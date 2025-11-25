const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/bookingController");


router.post("/checkout", ctrl.checkout);
router.post("/verify", ctrl.verify); 
router.get("/:id", ctrl.getBooking);

module.exports = router;
