require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cart = require("../model/cartSchema"); // ✅ Cart model import karo
const validator = require("validator");
const UserData = require("../model/userSchema");
const cookieParser = require("cookie-parser"); // Add this line

const router = express.Router();

router.use(cookieParser());

router.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, pass, confirmpass } = req.body;

    if (!name || !email || !mobile || !pass || !confirmpass) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (pass !== confirmpass) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    if (!validator.isEmail(email.trim())) {
      return res.status(400).json({ message: "Invalid email." });
    }

    if (!validator.isMobilePhone(mobile.toString().trim(), "en-IN") || mobile.length !== 10) {
      return res.status(400).json({ message: "Invalid mobile number." });
    }

    const existingUser = await UserData.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    const newUser = new UserData({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      pass: hashedPassword,
    });

    await newUser.save();

    // ✅ Register hone ke baad uska cart bhi create karo
    const newCart = new Cart({ user: newUser._id, items: [] });
    await newCart.save();

    newUser.cartId = newCart._id; // ✅ Cart ID UserData me add karo
    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, mobile, pass } = req.body;

    if ((!email && !mobile) || !pass) {
      return res
        .status(400)
        .json({ message: "Email/Mobile and password are required." });
    }

    const query = email
      ? { email: email.trim() }
      : { mobile: mobile.toString().trim() };

    const user = await UserData.findOne(query);

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email/mobile or password." });
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.pass);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.UJWT_SECRET, {
      expiresIn: "1h",
    });

    if (!process.env.UJWT_SECRET) {
      console.error("JWT Secret is missing in environment variables.");
      return res.status(500).json({ message: "Server error. Please contact support." });
    }

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production", // Ensure it's sent over HTTPS in production
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: "Strict", // Prevents CSRF attacks
    });

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;