const mongoose = require('mongoose');

// creates user schema
const todoSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        default: new mongoose.Types.ObjectId()
    },
    userName: {
        type: String,
        required: true
    },
    password: {
        type: String,
    },
    email:{
        type: String
    },
    list: {
        type: Array,
        default: []
    }
})

// creates user model
module.exports =  mongoose.model('users', todoSchema)