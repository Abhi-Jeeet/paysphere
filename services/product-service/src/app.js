const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const { initProducer } = require("./kafka/producer");
const productController = require("./controllers/productController");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//routes
app.get("/api/products", productController.listProducts);
app.get("/api/products/:id", productController.getProduct);
app.post("/api/products", productController.createProduct);
app.put("/api/products/:id", productController.updateProduct);
app.delete("/api/products/:id", productController.deleteProduct);


const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI;
const KAFKA_BROKER = process.env.KAFKA_BROKER;
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "product-service";


mongoose.connect(MONGO_URI, {})
    .then(async () => {
        console.log("Product DB Coonected");
        //init kafka producer
        try {
            await initProducer({ KAFKA_BROKER, KAFKA_CLIENT_ID });
            console.log("Kafka producer connected");

        }
        catch (err) {
            console.error("Kafka init failed:", err.message);
        }

        app.listen(PORT, () => {
            console.log(`Product service is runnnning on port ${PORT}`);

        })
        })
        .catch(err=>{
            console.error("DB connection error:", err.message);
            process.exit(1);
            
        })

    

