const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    dogId: {
        type: Schema.Types.ObjectId,
        ref: 'dog',
        required: true
    },
    characteristics: {
        type: String,
        required: true
    },
    values: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('category',categorySchema);
