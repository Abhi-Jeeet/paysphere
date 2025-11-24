const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
    productId: {
        type: String,
        required: true,
    },
    name: String,
    price: Number,
    quantity:{
        type: Number,
        default:1,
    },
    image: String,
    sku: String
},{_id:false});

const CartSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    items:[ItemSchema]
}, {timestamps:true});

module.exports = mongoose.model("Cart", CartSchema);