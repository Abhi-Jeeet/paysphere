const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js")

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Auth service DB connected");
    app.listen(PORT,()=> console.log(`Auth service running on port ${PORT}`)
    )
    
})
.catch(err=>console.log(err)
)