const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Entrez un nom de classe'],
        trim: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        require: false,
        trim: true
    }],
    cours: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cours",
        require: false,
        trim: true
    }]
},{
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//export model créé a partir du schema
module.exports = mongoose.model('Classe', classSchema);