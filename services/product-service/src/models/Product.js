const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
    },
    description:String,
    price:{
        type:Number,
        required: true,
    },
    images: [string],
    sku: string,
    stock: {
        type:Number,
        default:0,
    },
    isActive: {type: Boolean, 
        default: true,
    },
    createdBy: {
        type: String, //user id from auth
    },

}, {timestamps:true});

module.exports = mongoose.model("Product", productSchema);