const express = require("express");
const cors = require("cors");
const axios = require("axios");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const AUTH_SERVICE = process.env.AUTH_SERVICE_URL;

//JWT verification Middleware

function verifyToken(req, res, next){
    //public routes -> no auth
    if(
        req.path.startsWith("/auth/login")||
        req.path.startsWith("/auth/register")

    ){
        return next();
    }


const authHeader = req.headers.authorization;
if(!authHeader)
    return res.status(401).json({error: "No token provided"});

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //attach user info
        next();
    } catch (error) {
        return res.status(403).json({error: "Invalid token"});
    }
}

app.use(verifyToken);


//Auth service Routes -> Forwarded to port 5001

app.use("/auth", async(req,res)=>{
    try {
        const url = AUTH_SERVICE + req.url;
        const response = await axios({
            method: req.method,
            url:url,
            data:req.body,
            headers: req.headers,
        })

        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500)
            .json(error.response?.data || {error: "Gateway Error"});
    }
});


app.get("/", (req, res)=>{
    res.json({message:"API Gateway running......."})
})

app.listen(process.env.PORT,()=>{
    console.log(`API Gateway is runnnning on port ${process.env.PORT}`);
    
})