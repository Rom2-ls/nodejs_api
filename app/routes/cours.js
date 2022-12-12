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
        generatedCode = Math.floor(100000 + Math.random() * 900000)

        let cours = await coursModel.create({
            name: name,
            dateStart: dateStart,
            dateEnd: dateEnd,
            code: generatedCode
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
});

module.exports = router;