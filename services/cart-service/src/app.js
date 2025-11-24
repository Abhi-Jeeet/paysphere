const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("Cart DB connected");
        app.listen(()=>console.log(`Cart service is runnnning at Port ${PORT}`)
        )
        
    })
    .catch(err=>{
        console.error("DB connection error:", err.message);
        process.exit(1);
        
    })