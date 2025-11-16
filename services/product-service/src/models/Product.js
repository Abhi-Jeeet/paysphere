const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{type:String, required:true},
    description: String,
    price: {
        type:Number,
        required:true,
    },
    qty:{
        type:Number, 
        default:0,
    },
    metadata:{
        type:Object,
        default:{},
    }
}, {timestamps:true});

module.exports = mongoose.model("Product", productSchema);
