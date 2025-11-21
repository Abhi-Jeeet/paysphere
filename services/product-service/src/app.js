const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");
const { initKafka } = require("./kafka/producer");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/products", productRoutes);

const PORT = process.env.PORT || 5002;

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Product Service DB Connected");

        // Kafka connect
        await initKafka();

        app.listen(PORT, () => {
            console.log(`Product Service running on port ${PORT}`);
        });
    })
    .catch((err) => console.log("DB Error:", err));
