const express = require('express');
const classModel = require('../models/classe');

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

		classe = await classModel.findOneAndUpdate({
			_id: classId.trim()
		},{
			$push: { students: [studentId.trim()] }
		},
		{
			new: true
		}).populate("students");

		return res.status(200).json(classe);
	} catch (error) {
		return res.status(500).json(error);
	}
})
.post('/add-cours', async (req, res) => {
	try {
		const {coursId, classId} = req.body;

		classe = await classModel.findOneAndUpdate({
			_id: classId.trim()
		},{
			$push: { cours: [coursId.trim()] }
		},
		{
			new: true
		}).populate("cours");

		return res.status(200).json(classe);
	} catch (e) {
		return res.status(500).json({msg: e})
	}
})

module.exports = router;