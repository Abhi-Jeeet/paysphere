const Booking = require("../models/Booking");
const Razorpay = require("razorpay");
const axios = require("axios");
const crypto = require("crypto");

// Safe Razorpay initialization: trim env vars and avoid throwing at module load
let razorpay = null;
try {
  const keyId = (process.env.RAZORPAY_KEY_ID || "").trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || "").trim();
  console.log("RAZORPAY_KEY_ID present:", !!keyId);
  console.log("RAZORPAY_KEY_SECRET present:", !!keySecret);
  if (!keyId || !keySecret) {
    console.warn("Razorpay keys missing: checkout/verify endpoints will be unavailable");
  } else {
    razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    console.log("Razorpay initialized successfully");
  }
} catch (initErr) {
  console.error("Razorpay init failed:", initErr && initErr.message ? initErr.message : initErr);
  razorpay = null;
}

// Helper: fetch product prices from Product Service to validate totals
async function getProductDetails(productId) {
  const url = `${process.env.PRODUCT_SERVICE_URL}/${productId}`;
  const res = await axios.get(url);
  // assumes product service returns product JSON at res.data
  return res.data;
}

exports.checkout = async (req, res) => {
  try {
    // Gateway attaches x-user-id and x-role
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User id missing" });

    const { items } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid cart items" });
    }

    // Validate and compute final amount (paise)
    let total = 0;
    const validatedItems = [];
    for (const it of items) {
      // fetch product from product service to prevent price tampering
      const product = await getProductDetails(it.productId);
      if (!product) return res.status(400).json({ error: "Invalid product " + it.productId });

      const qty = Number(it.quantity) || 1;
      const price = Number(product.price); // assume product.price is in rupees
      total += Math.round(price * 100) * qty; // convert to paise
      validatedItems.push({
        productId: it.productId,
        name: product.name,
        price: Math.round(price * 100),
        quantity: qty
      });
    }

    // Create booking in DB with status 'created'
    const booking = await Booking.create({
      userId,
      items: validatedItems,
      amount: total,
      currency: "INR",
      status: "created"
    });

    // Create Razorpay order
    if (!razorpay) {
      return res.status(503).json({ error: "Payment gateway unavailable", details: "Razorpay not configured on server" });
    }

    const options = {
      amount: total, // paise
      currency: "INR",
      receipt: `booking_rcpt_${booking._id}`,
      payment_capture: 1 // auto-capture, or 0 for manual capture
    };

    const rorder = await razorpay.orders.create(options);

    booking.razorpayOrderId = rorder.id;
    await booking.save();

    return res.json({
      bookingId: booking._id,
      orderId: rorder.id,
      amount: total,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (err) {
    console.error("Checkout error:", err.message || err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.verify = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({ error: "Payment gateway unavailable", details: "Razorpay not configured on server" });
    }

    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User id missing" });

    const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!bookingId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: "Missing payment fields" });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.warn("Signature mismatch", expectedSignature, razorpay_signature);
      await Booking.findByIdAndUpdate(bookingId, { status: "failed" });
      return res.status(400).json({ error: "Invalid signature" });
    }

    // Save payment info
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    booking.razorpayPaymentId = razorpay_payment_id;
    booking.razorpaySignature = razorpay_signature;
    booking.status = "paid";
    await booking.save();

 

    return res.json({ success: true, bookingId: booking._id });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: "Server error", details: err.message });
  }
};

exports.getBooking = async (req, res) => {
  try {
    const userId = req.headers["x-user-id"];
    if (!userId) return res.status(401).json({ error: "User id missing" });

    const booking = await Booking.findOne({ _id: req.params.id, userId });
    if (!booking) return res.status(404).json({ error: "Not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};
