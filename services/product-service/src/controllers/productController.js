const Product = require("../models/Product");


//public
exports.listProducts = async(req, res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 12, 100);
    const skip = (page-1)*limit;

    const q = {isActive: true};
    if(req.query.q) q.name = {$regex: req.query.q, $options: "i"};

    const [items, total] = await Promise.all([
        Product.find(q).skip(skip).limit(limit).sort({createdAt: -1}),
        Product.countDocuments(q)
    ]);
    res.json({items, total, page, limit});
};

//public: get single product
exports.getProduct = async(req, res)=>{
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(400).json({error:"Product not found"});
    res.json(p);
};

//admin create product
exports.createProduct = async(req, res)=>{
    const body = req.body;
    if(req.headers["x-user-id"]) body.createdBy = req.headers["x-user-id"];
    const p = await Product.create(body);
    //Kafka
    res.status(201).json(p);
};

//admin product update
exports.updateProduct = async(req, res)=>{
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!p) return res.status(401).json({error:"Product no"});
    res.json(p);
}

//admin delete product
exports.deleteProduct = async (req, res) => {
  console.log("Deleting product id:", req.params.id);

  const p = await Product.findByIdAndDelete(req.params.id);
  if (!p) return res.status(404).json({ error: "Product not found" });

  res.json({ message: "Product deleted" });
};