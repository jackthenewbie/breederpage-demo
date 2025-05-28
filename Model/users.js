const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const breederSchema = new Schema({
    firstName: {
        type: String,
        required: true
    }, 
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    userType:{
        type: String,
        required:true
    }, 
    password: {
        type: String,
        required: true
    }, 
    dateCreated: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('breeder',breederSchema)
