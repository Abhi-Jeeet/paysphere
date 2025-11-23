const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandles");
const ctrl = require("../controllers/productController");

//public
router.get("/", asyncHandler(ctrl.listProducts));
router.get("/:id", asyncHandler(ctrl.getProduct));

//admin (gateway should enforce role; product service trusts gateway)
router.post("/", asyncHandler(ctrl.createProduct));
router.put("/:id", asyncHandler(ctrl.updateProduct));
router.delete("/:id", asyncHandler(ctrl.deleteProduct));

module.exports = router;
