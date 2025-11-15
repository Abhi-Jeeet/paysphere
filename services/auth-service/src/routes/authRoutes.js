const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

//register
router.post("/register", async(req, res)=>{
    try {
        const {name, email, password} = req.body;
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({name, email, password:hashed});
    // send a response so the client request completes
    res.status(201).json({ message: "User created", user });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


//login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // compare plaintext with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//verify token middleware
function verifyToken(req, res, next){
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({error: "No token provided"});

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({error: "Invalid token"});
  }
}

function requireRole(role){
  return(req, res, next)=>{
    if(!req.user) return res.status(401).json({error: "No user in request"});
    if(req.user.role !==role) return res.status(403).json({error: "Forbidden: insufficient role"});
    next();
  }
}

//get current user
router.get("/me", verifyToken, async(req, res)=>{
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({user});
  } catch (error) {
    res.status(500).json({error: "Server error"});
  }
});

router.get("/admin-only", verifyToken, requireRole("admin"), async(req,res)=>{
  res.json({message:"Welcome admin!",
    id: req.user.id,
    role: req.user.role});
})


module.exports = router;



