const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
        required:true,
        trim:true
    },
    img:{
        type:String,
        require:true,
        trim:true
    },
    createBy:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    created:{
        type:Date,
        default:Date.now()
    }
        
})

module.exports = mongoose.model('Product',ProductSchema)