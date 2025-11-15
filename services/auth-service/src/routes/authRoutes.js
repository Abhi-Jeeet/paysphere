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


module.exports = router;



