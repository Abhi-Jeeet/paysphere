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
        res.status(201)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});


//login
router.post("/login", async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(404).json({error:"User not found"});

        const valid = await bcrypt.compare(password, user.password);
        if(!valid) return res.status(401).json({error: "Invalid credentials"});

        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIN: "id"}
        );
        res.json({token});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;



