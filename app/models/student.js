const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        require: [true, 'Entrez un prénom'],
        trim: true
    },
    lastname: {
        type: String,
        require: [true, 'Entrez un nom'],
        trim: true
    },
    class:{
        type: mongoose.Schema.Types.ObjectId, ref: 'classSchema',
        require : false,
        trim: true
    }
},{
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//export model créé a partir du schema
module.exports = mongoose.model('Student', studentSchema);