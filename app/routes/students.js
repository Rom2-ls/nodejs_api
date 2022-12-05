const express = require('express');
const bcrypt = require('bcrypt');

const studentModel = require('../models/student');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { firstname,
        lastname,
        email,
        email_cfg,
        password,
        password_cfg
    } = req.body;

    if (typeof firstname === 'undefined' || firstname.trim() === "" ||
        typeof lastname === 'undefined' || lastname.trim() === "" ||
        typeof email ==='undefined' || email.trim() === "" ||
        typeof email_cfg ==='undefined' || email_cfg.trim() === "" ||
        typeof password ==='undefined' || password.trim() === "" ||
        typeof password_cfg ==='undefined' || password_cfg.trim() === "") {
        return res.status(500).json({"msg": "Remplissez tous les champs"});
    }

    if (email != email_cfg || password != password_cfg) {
        return res.status(500).json({"msg": "Le mail ou mot de passe ne correspondent pas"})
    }

    if (!email.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim)) {
        return res.status(500).json({"msg": "Le mail n'est pas conforme"})
    }

    if (!password.match(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/gm)) {
        return res.status(500).json({"msg": "Le mot de passe n'est pas conforme"})
    }

    try {
        let findStudent = await studentModel.findOne({ email });
        if (findStudent) {
            return res.status(500).json({"msg": "Cet email existe déjà."});
        }

        let student = await studentModel.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: bcrypt.hashSync(password, 10)
        });

        return res.status(200).json(student);
    } catch (e) {
        return res.status(500).json({"msg": "Une erreur est survenue : " + e})
    }
})
.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        let findStudent = await studentModel.findOne({ email });
        if (findStudent && await bcrypt.compare(password,findStudent.password)) {
            req.session.student = findStudent;
            return res.status(200).json({"msg": "user logged in"});
        } else {
            return res.status(500).json({"msg": "Email ou mot de passe incorrect"});
        }
    } catch (error) {
        return res.status(500).json({"msg": "Une erreur est survenue : " + e})
    }
})
.get('/me', async (req, res) => {
    return res.status(200).json({"msg": req.session.student});
})
.get('/', async (req, res) => {
    try {
        let data = await studentModel.find();
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