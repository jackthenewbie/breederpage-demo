const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dogSchema = new Schema({
    breederId: {
        type: Schema.Types.ObjectId,
        ref: 'breeder',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    }
})

module.exports = mongoose.model('dog',dogSchema);
