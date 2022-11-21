const mongoose = require("mongoose")

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Entrez un nom de classe'],
        trim: true
    }
},{
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

//export model créé a partir du schema
module.exports = mongoose.model('Classe', classSchema);