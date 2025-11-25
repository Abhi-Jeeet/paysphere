const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

// CRITICAL: Load .env BEFORE requiring any other modules that depend on process.env
dotenv.config();
console.log("LOADED ENV:", {
  id: process.env.RAZORPAY_KEY_ID ? "present" : "missing",
  secret: process.env.RAZORPAY_KEY_SECRET ? "present" : "missing",
  port: process.env.PORT
});

const bookingRoutes = require("./routes/bookingRoutes");
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/booking", bookingRoutes);

app.get("/", (req, res) => res.json({ msg: "Booking service running" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Booking DB connected");
    app.listen(process.env.PORT, () => {
      console.log("Booking service listening on", process.env.PORT);
    });
  })
  .catch(err => {
    console.error("DB connect error", err);
    process.exit(1);
  });
