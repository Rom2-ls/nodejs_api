const mongoose = require('mongoose')

const coursSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, 'Entrez un nom de classe'],
        trim: true
    },
    dateStart: {
        type: Date,
        require: true,
        //min: Date.now
    },
    dateEnd: {
        type: Date,
        require: true,
        min: this.dateStart
    },
    presence: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        require: false,
        trim: true
    }]
},{
    timestamps : {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

module.exports = mongoose.model('Cours', coursSchema);