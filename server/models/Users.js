const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required: true,
        max:255,
        min:6,
        trim:true
    },
    email: {
        type: String,
        required:true,
        max:255,
        min:6,
        trim:true
    },
    telephone:{
        type:String,
        trim:true
    },
    password: {
        type: String,
        required:true,
        max:1024,
        min:6,
        trim:true
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model('User',userSchema)
