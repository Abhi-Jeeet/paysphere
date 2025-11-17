const Product = require("../models/Product");
const {publish} = require("../kafka/producer");

//helper to check admin via header
function ensureAdmin(req, res){
    const role = req.headers["x-user-role"] || req.headers["x-role"];
    if(!role || role !== "admin"){
        res.status(403).json({error:"Forbidden: admin only"});
        return false;
    }
    return true;
}

exports.listProducts = async(req, res)=>{
    try{
        const products = await Product.find().lean();
        res.json(products);
    } catch(err){
        res.status(500).json({error: err.message});
    }
};

exports.getProduct = async(req, res)=>{
    try {
        const products = await Product.findById(req.params.id).lean();
        if(!products) return res.status(404).json({error: "Product not found"});
        res.json(products);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.createProduct = async(req, res)=>{
    try {
        if(!ensureAdmin(req, res))return;
        const {name, description, price, qty, metadata} = req.body;
        const prod = await Product.create({name, description, price, qty, metadata});

        //publish event
        await publish("product-created", {action : "created", product: prod});
        res.status(201).json(prod);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

exports.updateProduct = async(req, res)=>{
    try {
        if(!ensureAdmin(req, res)) return;
        const updates = req.body;
        const prod = await Product.findByIdAndUpdate(req.params.id, updates, {new: true}).lean();
        if(!prod) return res.status(404).json({error: "Product not found"});
        await publish("product-updated", {action: "updated", product:prod});
        res.json(prod);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};


exports.deleteProduct = async(req, res)=>{
    try {
        if(!ensureAdmin(req, res)) return;
        const prod = await Product.findByIdAndDelete(req.params.id).lean();
        if(!prod) return res.status(400).json({error: "Product not found"});
        await publish("product-deleted",{action: "deleted", product:prod});
        res.json({message: "Deleted", product:prod});
    } catch (error) {
        res.status(500).json({error: err.message});
    }
}