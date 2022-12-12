const express = require('express');
const classModel = require('../models/classe');
const studentModel = require('../models/student');
const coursModel = require ('../models/cours');
const classe = require('../models/classe');

let router = express.Router();

router.post('/', async (req, res) => {
	const {name} = req.body;

	if (typeof name === 'undefined' || name == "") {
		return res.status(500).json({"msg": "Vous devez enter un nom de classe"});
	}

	try {
		let classe = await classModel.create({
			name: name
		});
		return res.status(200).json(classe);
	} catch (e) {
		return res.status(500).json({"msg": "Une erreur est survenue : " + e})
	}
})
.get('/', async (req, res) => {
	try {
        let data = await classModel.find();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.get('/:id', async (req, res) => {
	try {
        const {id} = req.params;
        let data = await classModel.findById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.delete('/:id', async (req, res) => {
	try {
        const {id} = req.params;
        await classModel.findByIdAndDelete(id);
        return res.status(200).json(classModel);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.put('/:id', async (req, res) => {
	try {
		const {id} = req.params;
		const {name} = req.body;
		await classModel.findByIdAndUpdate(id, {name: name});
		return res.status(200).json(studentModel);
	} catch (e) {
		return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
	}
})
.post('/add-student', async (req, res) => {
	try {
		const {studentId, classId} = req.body;

		//add student to class
		classe = await classModel.findOneAndUpdate({
			_id: classId.trim()
		},{
			$push: { students: [studentId.trim()] }
		},
		{
			new: true
		}).populate("students");

		//add class to student
		student = await studentModel.findOneAndUpdate({
			_id: studentId.trim()
		}, {
			$push: { class: [classId.trim()] }
		}).populate("class")

		return res.status(200).json({"classe": classe, "student": student});
	} catch (error) {
		return res.status(500).json(error);
	}
})
.post('/add-cours', async (req, res) => {
	const {classId, name, dateStart, dateEnd} = req.body;

	if (typeof classId === 'undefined' || classId.trim() === '' ||
		typeof name === 'undefined' || name.trim() === '' ||
		typeof dateStart === 'undefined' || dateStart.trim() === '' ||
		typeof dateEnd === 'undefined' || dateEnd.trim() === '') {
	return res.status(500).json({msg: "Remplissez tous les champs"})
	}

	try {
		generatedCode = Math.floor(100000 + Math.random() * 900000)
	
		//create a course
		let cours = await coursModel.create({
			name: name,
			dateStart: dateStart,
			dateEnd: dateEnd,
			code: generatedCode
		});

		//add course to classe
		classe = await classModel.findOneAndUpdate({
			_id: classId.trim()
		},{
			$push: { cours: [cours._id] }
		},
		{
			new: true
		}).populate("cours");

		return res.status(200).json(classe);
	} catch (e) {
		return res.status(500).json({msg: "" + e})
	}
})
.post('/sign-cours', async (req, res) => {
    const student = req.session.student
    const {code} = req.body

	if (student) {
		try {
            const currentDate = new Date()

			let classe = await classModel.findById(student.class)

			let check = await coursModel.findOne({
				_id: { $in: classe.cours },
                dateStart: { $lte: currentDate },
                dateEnd: { $gte: currentDate },
            })

            if (check.code != code) {
                return res.status(200).json({msg: "Le code de vérification ne correspond pas"})
            } else if (check.presence.includes(student._id)) {
                return res.status(200).json({msg: "Vous êtes déjà enregistré au cours"})
            } else {
                cours = await coursModel.findOneAndUpdate({
                    dateStart: { $lte: currentDate },
                    dateEnd: { $gte: currentDate },
                }, {
                    $push: { presence: [student._id.trim()] }
                }, {
                    new: true
                }).populate("presence");    
            }
			return res.status(200).json(cours);
		} catch (error) {
            return res.status(500).json({msg: "erreur : " + error})
		}
	} else {
		return res.status(500).json({msg: "Vous n'êtes pas connecté"})
	}
});

module.exports = router;