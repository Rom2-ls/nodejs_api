const express = require('express');
const coursModel = require ('../models/cours');
const student = require('../models/student');

let router = express.Router();

router.post('/', async (req, res) => {
    const {name, dateStart, dateEnd} = req.body;

    if (typeof name === 'undefined' || name.trim() === '' ||
        typeof dateStart === 'undefined' || dateStart.trim() === '' ||
        typeof dateEnd === 'undefined' || dateEnd.trim() === '') {
            return res.status(500).json({msg: "Remplissez tous les champs"})
        }

    try {
        let cours = await coursModel.create({
            name: name,
            dateStart: dateStart,
            dateEnd: dateEnd
        });

        return res.status(200).json(cours)
    } catch (error) {
        return res.status(500).json({"msg": "Une erreur est survenue : " + error})

    }
})
.get('/', async (req, res) => {
    try {
        let data = await coursModel.find();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        let data = await coursModel.findById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await coursModel.findByIdAndDelete(id);
        return res.status(200).json(coursModel);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {name, dateStart, dateEnd} = req.body;
        await coursModel.findByIdAndUpdate(id, {name, dateStart, dateEnd});
        return res.status(200).json(coursModel);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.post('/sign-cours', async (req, res) => {
    const studentId = req.session.student._id

	if (studentId) {
		try {
            const currentDate = new Date()

			check = await coursModel.findOne({
                dateStart: { $lte: currentDate },
                dateEnd: { $gte: currentDate },
            })

            if (check.presence.includes(studentId)) {
                return res.status(200).json({msg: "Vous êtes déjà enregistré au cours"})
            } else {
                cours = await coursModel.findOneAndUpdate({
                    dateStart: { $lte: currentDate },
                    dateEnd: { $gte: currentDate },
                }, {
                    $push: { presence: [studentId.trim()] }
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
})

module.exports = router;