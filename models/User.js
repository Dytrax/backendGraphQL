const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:[true, 'Please add an email'],
        maxlength:[50, 'nationality cannot be more than 50 characters'],
        trim:true,
        validate: {
            validator: function (value) {
                // check for correct email format
                return /^[a-zA-Z0-9.!#$%&’*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(value)
            },
            message: `Please enter a valid email address!`
        }
    },
    username:{
        type:String,
        required: [true, 'Please add an alphanumeric name'],
        maxlength:[20, 'Name cannot be more than 20 characters'],
        minlength:[4,'Name cannot be less than 4 characters'],
        trim:true,
        validate: {
            validator: function (value) {
                // check for correct email format
                return /^[a-z0-9]+$/i.test(value)
            },
            message: `Please enter a valid email address!`
        }
    },
    
    password:{
        type:String,
        required:[true, 'Please add a password'],
        trim:true
        //maxlength:[20, 'password cannot be more than 20 characters'],
    },
    created:{
        type:Date,
        default:Date.now()
    }
})

module.exports = mongoose.model('User',UserSchema)