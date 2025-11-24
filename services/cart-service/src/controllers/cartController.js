const Cart = require("../models/Cart");
const axios = require("axios");

// Normalize PRODUCT_SERVICE to avoid trailing slash issues.
// If env var is missing or only whitespace, fall back to the default product-service URL.
const _rawProductService = (process.env.PRODUCT_SERVICE_URL || "").trim();
const PRODUCT_SERVICE = (_rawProductService || "http://localhost:5002/api/products").replace(/\/$/, "");

console.log("CartService: using PRODUCT_SERVICE=", PRODUCT_SERVICE);

//get or create cart
async function getCartForUser(userId){
    let cart = await Cart.findOne({userId});
    if(!cart){
        cart = await Cart.create({userId, items:[]});
    }
    return cart;
}

// GET /api/cart/   -> get current user's cart
exports.getCart = async(req, res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId)return res.status(401).json({error: "No user id"});
    const cart = await getCartForUser(userId);
    res.json(cart);
};

//Post /api/cart/add  -> {productId, quantity}
exports.addToCart = async(req, res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId) return res.status(401).json({error: "No user id"});

    const {productId, quantity=1}=req.body;
    if(!productId) return res.status(400).json({error: "ProductId required"});

    //Fetch product snapshot from product service
    let product;
    const productUrl = `${PRODUCT_SERVICE}/${productId}`;
    console.log(`CartService: fetching product snapshot from ${productUrl} for user ${userId}`);
    try {
        const p = await axios.get(productUrl);
        product = p.data;
    } catch (error) {
        console.error("CartService: product fetch error", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: error.config && { url: error.config.url, method: error.config.method }
        });

        // If product-service responded with a status (e.g. 404), forward that status and data.
        if (error.response) {
            return res.status(error.response.status).json(error.response.data || { error: "Product not found" });
        }

        // Network / other error
        return res.status(502).json({ error: "Product service unavailable", details: error.message });
    }

    const cart = await getCartForUser(userId);

    //if item exists, update quantity
    const idx = cart.items.findIndex(i=>i.productId === productId);
    if(idx > -1){
        cart.items[idx].quantity += Number(quantity);
        //update price snapshot if needed
        cart.items[idx].price = product.price;
    }
    else{
        cart.items.push({
            productId,
            name: product.name,
            price: product.price,
            image: product.images?.[0] || "",
            quantity: Number(quantity),
            sku: product.sku || null
        });
    }

    await cart.save();
    res.status(200).json(cart);
};

//// PUT /api/cart/item/:productId  -> { quantity }

exports.updateItem = async(req,res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId) return res.status(401).json({error: " No user id"});

    const productId = req.params.productId;
    const {quantity} = req.body;
    if(quantity==null) return res.status(400).json({error: "quantity required"});

    const cart = await getCartForUser(userId);
    const idx = cart.items.findIndex(i=> i.productId === productId);
    if(idx === -1) return res.status(404).json({error: "Item not in cart"});

    if(Number(quantity) <=0 ){
        cart.items.splice(idx,1);
    }else{
        cart.items[idx].quantity = Number(quantity);
    }

    await cart.save();
    res.json(cart);
};

//Delete /api/cart/item/:productId
exports.removeItem = async(req, res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId) return res.status(401).json({error: "No user id"});

    const productId = req.params.productId;
    const cart = await getCartForUser(userId);
    const before = cart.items.length;
    cart.items = cart.items.filter(i=>i.productId!== productId);

    if(cart.items.length === before) return res.status(404).json({error: "Item not found"});

    await cart.save();
    res.json(cart);
};

//post /api/cart/clear
exports.clearCart = async(req, res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId)return res.status(401).json({error: "no user id"});

    let cart = await getCartForUser(userId);
    cart.items = [];
    await cart.save();
    res.json(cart);
};

//post /api/cart/checkout ->
exports.checkout = async(req,res)=>{
    const userId = req.headers["x-user-id"];
    if(!userId) return res.status(401).json({error: "No user id"});

    const cart = await getCartForUser(userId);
    if(!cart.items.length) return res.status(400).json({error: "cart empty"});
    
    //order service api later

    const total = cart.items.reduce((s,it)=> s + (it.price || 0)* it.quantity, 0);

    cart.items = [];
    await cart.save();

    res.json({message: "checked out", total});
};
