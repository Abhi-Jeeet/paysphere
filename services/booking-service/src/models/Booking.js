const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      productId: { type: String, required: true },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  amount: { type: Number, required: true }, 
  currency: { type: String, default: "INR" },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
  status: { type: String, enum: ["created", "paid", "failed"], default: "created" }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
