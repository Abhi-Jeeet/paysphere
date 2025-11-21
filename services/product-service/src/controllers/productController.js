const Product = require("../models/Product");
const { publish } = require("../kafka/producer");

// Helper to check admin role
function requireAdmin(req, res) {
    const role = req.headers["x-user-role"];
    if (role !== "admin") {
        res.status(403).json({ error: "Admin permission required" });
        return false;
    }
    return true;
}

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).lean();
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createProduct = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
        const product = await Product.create(req.body);

        // Publish event to Kafka
        await publish("product-created", { product });

        res.status(201).json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateProduct = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).lean();

        if (!product) return res.status(404).json({ error: "Product not found" });

        await publish("product-updated", { product });

        res.json(product);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteProduct = async (req, res) => {
    if (!requireAdmin(req, res)) return;

    try {
        const product = await Product.findByIdAndDelete(req.params.id).lean();

        if (!product) return res.status(404).json({ error: "Product not found" });

        await publish("product-deleted", { productId: product._id });

        res.json({ message: "Product deleted", product });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
