const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/cartController");

// public: none — cart endpoints require user id (gateway must provide or fail)
router.get("/", ctrl.getCart);
router.post("/add", ctrl.addToCart);

router.put("/item/:productId", ctrl.updateItem);
router.delete("/item/:productId", ctrl.removeItem);

router.post("/clear", ctrl.clearCart);
router.post("/checkout", ctrl.checkout);

module.exports = router;