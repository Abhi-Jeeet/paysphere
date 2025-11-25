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
        req.path.startsWith("/auth/register")||
        (req.method === "GET" && req.path.startsWith("/products"))

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

//Product Service

app.use("/products", async(req, res)=>{
    try {
        const url = process.env.PRODUCT_SERVICE_URL + req.url;// e.g. http://localhost:5002/api/products + / or /:id

        // Add user context headers (gateway verified token earlier)
        const forwardHeaders = {...req.headers};
        delete forwardHeaders["if-none-match"];
        delete forwardHeaders["if-modified-since"];
        delete forwardHeaders["cache-control"];
        if(req.user){
            forwardHeaders["x-user-id"] = req.user.id;
            forwardHeaders["x-role"] = req.user.role;
        }
        const response = await axios({
            method:req.method,
            url,
            data:req.body,
            headers: forwardHeaders,
        });
        res.status(response.status).json(response.data);

    } catch (error) {
        console.log("GATEWAY -> products error:", error.message);
        if(error.response){
            res.status(error.response.status).json(error.response.data);
        }
        else{
            res.status(500).json({error:"Gateway Error", details: error.message});
        }
        
    }
});

// Helper to clean headers (remove caching/browser-specific headers)
function cleanHeaders(headers) {
    const cleaned = { ...headers };
    delete cleaned["if-none-match"];
    delete cleaned["if-modified-since"];
    delete cleaned["cache-control"];
    delete cleaned["host"];
    return cleaned;
}

//CART forwarder
app.use("/cart", async(req,res)=>{
    try {
        const url = process.env.CART_SERVICE_URL + req.url; // e.g. http://localhost:5005/api/cart + /add or / or /item/:id
        console.log("Forwarding to:", url);
        const forwardHeaders = { ...req.headers };
        delete forwardHeaders["if-none-match"];
        delete forwardHeaders["if-modified-since"];
        delete forwardHeaders["cache-control"];

        // forward user context from verifyToken (gateway attaches req.user)
        if (req.user) {
            forwardHeaders["x-user-id"] = req.user.id;
            forwardHeaders["x-role"] = req.user.role;
        }

         const response = await axios({
            method: req.method,
            url,
            data: req.body,
            headers: forwardHeaders
        });
         return res.status(response.status).json(response.data);
    } catch (error) {
        console.log("🔥 FULL CART ERROR:");
console.log("Message:", error.message);
console.log("Name:", error.name);
console.log("Code:", error.code);
console.log("Stack:", error.stack);
console.log("Response data:", error.response?.data);
console.log("Response status:", error.response?.status);
console.log("Config:", error.config);
        if (error.response) return res.status(error.response.status).json(error.response.data);
        return res.status(500).json({ error: "Gateway Error", details: error.message });
    }
})

// BOOKING FORWARDER
app.use("/booking", async (req, res) => {
  try {
    const url = process.env.BOOKING_SERVICE_URL + req.url;
    console.log("Forwarding to booking:", url);
    const fwdHeaders = cleanHeaders(req.headers);
    if (req.user) {
      fwdHeaders["x-user-id"] = req.user.id;
      fwdHeaders["x-role"] = req.user.role;
    }
    const response = await axios({
      method: req.method,
      url,
      data: req.body,
      headers: fwdHeaders,
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.log("BOOKING ERROR:", error.message);
    if (error.response) {
      console.log("Booking service responded:", error.response.status, error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(500).json({ error: "Gateway Error", details: error.message });
  }
});


app.get("/", (req, res)=>{
    res.json({message:"API Gateway running......."})
})

app.listen(process.env.PORT,()=>{
    console.log(`API Gateway is runnnning on port ${process.env.PORT}`);
    
})