const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes = require("./routes/productRoutes");


dotenv.config();
const app = express();
app.use(express.json());

//routes
app.use("/api/products", productRoutes);

//DB connection
const PORT = process.env.PORT || 5002;
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Product DB Connected");
        app.listen(PORT, ()=> console.log(`Product service is running at ${PORT}`)
        )
        
    })
    .catch(err=>{
        console.log("DB connection error:", err.message);
        process.exit(1);
        
    })
