require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/businessUserSchema");
const router = express.Router();

router.post("/businessregister", async (req, res) => {
  try {
    let {
      name,
      location,
      email,
      category,
      businessName,
      registrationNumber,
      registrationAuthority,
      registrationDate,
      directorName,
      contactPersonName,
      contactPersonEmail,
      contactPersonDesignation,
      contactPersonMobile,
      password,
      confirmpassword,
    } = req.body;

    email = email?.trim()?.toLowerCase() || "";
    contactPersonEmail = contactPersonEmail?.trim()?.toLowerCase() || "";
    contactPersonMobile = contactPersonMobile?.trim() || "";

    if (!name || !location || !email || !category || !businessName || !registrationNumber || 
        !registrationAuthority || !registrationDate || !directorName || !contactPersonName || 
        !contactPersonEmail || !contactPersonDesignation || !contactPersonMobile || !password || !confirmpassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || !emailRegex.test(contactPersonEmail)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(contactPersonMobile)) {
      return res.status(400).json({ message: "Invalid mobile number format. Must be 10 digits." });
    }

    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { contactPersonMobile }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email 
          ? "Email is already registered. Please login." 
          : "Mobile number is already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      location,
      email,
      category,
      businessName,
      registrationNumber,
      registrationAuthority,
      registrationDate,
      directorName,
      contactPersonName,
      contactPersonEmail,
      contactPersonDesignation,
      contactPersonMobile,
      password: hashedPassword,
      status: "pending",
    });

    await newUser.save();
    res.status(201).json({ message: "Business registered successfully. Awaiting approval." });

  } catch (error) {
    console.error("Error in Business Registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/businesslogin", async (req, res) => {
  try {
    const { contactPersonEmail, contactPersonMobile, password } = req.body;

    if ((!contactPersonEmail && !contactPersonMobile) || !password) {
      return res.status(400).json({ message: "Email or Mobile and Password are required." });
    }

    const userQuery = contactPersonEmail 
      ? { contactPersonEmail: contactPersonEmail.trim().toLowerCase() } 
      : { contactPersonMobile: contactPersonMobile.trim() };

    const user = await User.findOne(userQuery);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or mobile. User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    if (!process.env.BJWT_SECRET) {
      console.error("JWT Secret is missing in environment variables.");
      return res.status(500).json({ message: "Server error. Please contact support." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.BJWT_SECRET, { expiresIn: "2h" });

    res.cookie("auth_token", token, {
      httpOnly: true,  
      secure: process.env.NODE_ENV === "production",  
      sameSite: "Lax", 
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error in Business Login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/businesslogout", (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  });

  res.status(200).json({ message: "Logged out successfully." });
});

module.exports = router;