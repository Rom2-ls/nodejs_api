const express = require('express');
const mongoose = require('mongoose');
const studentModel = require('../models/student');

let router = express.Router();

router.post('/', async (req, res) => {
    const {firstname, lastname} = req.body;

    if (typeof firstname === 'undefined' || typeof lastname === 'undefined') {
        return res.status(500).json({"msg": "Vous devez enter un nom et un prénom"});
    }

    try {
        let student = await studentModel.create({
            firstname: firstname,
            lastname: lastname
        });

        return res.status(200).json(student);
    } catch (e) {
        return res.status(500).json({"msg": "Une erreur est survenue : " + e})
    }
})
.get('/', async (req, res) => {
    try {
        let data = await studentModel.find();
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.get('/test', async (req, res) => {
    try {
        let data = await studentModel.find().populate('class');
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.get('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        let data = await studentModel.findById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.delete('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await studentModel.findByIdAndDelete(id);
        return res.status(200).json(studentModel);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
})
.put('/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {firstname} = req.body;
        const {lastname} = req.body;
        await studentModel.findByIdAndUpdate(id, {firstname: firstname, lastname: lastname});
        return res.status(200).json(studentModel);
    } catch (e) {
        return res.status(500).json({"msg" : "Une erreur est survenue : " + e});
    }
});

module.exports = router;