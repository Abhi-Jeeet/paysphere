const express = require("express");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");


const router = express.Router();

router.get("/", getAllProducts); //public
router.get("/:id", getProductById); //public
router.get("/", createProduct); //admin
router.get("/:id", updateProduct); //admin
router.get("/:id", deleteProduct); //admin

module.exports = router;
