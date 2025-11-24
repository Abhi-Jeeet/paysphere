const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cartRoutes = require("./routes/cartRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes

app.use("/api/cart", cartRoutes);

const PORT = Number(process.env.PORT) || 5003;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Cart DB connected");
        app.listen(PORT, () => console.log(`Cart service is runnnning at Port ${PORT}`));
    })
    .catch(err=>{
        console.error("DB connection error:", err.message);
        process.exit(1);
        
    })