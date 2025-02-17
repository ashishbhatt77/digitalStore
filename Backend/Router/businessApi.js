require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/businessUserSchema");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); // This import is now unnecessary for OTP generation
const router = express.Router();

// Forgot Password Route - To initiate OTP-based password reset
router.post("/businessUserForgotpassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ contactPersonEmail: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    // Generate a 4-digit OTP using Math.random()
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
    const otpExpiration = Date.now() + 300000; // OTP valid for 5 minutes

    // Save OTP and its expiration to the user record
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send OTP via email
    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP has been sent to your email." });
  } catch (error) {
    console.error("Error in Forgot Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Helper function to send OTP email
const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // You can change this to your email service provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP for Password Reset",
    html: `<p>Your OTP for resetting the password is: <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Reset Password Route - To reset the password using OTP
router.post("/BusinessUserResetpassword", async (req, res) => {
  try {
    const { otp, newPassword, confirmNewPassword, email } = req.body;

    if (!otp || !newPassword || !confirmNewPassword || !email) {
      return res.status(400).json({ message: "OTP, new password, and email are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    // Find user based on email and check OTP validity
    const user = await User.findOne({ contactPersonEmail: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    user.otp = undefined; // Clear OTP after successful reset
    user.otpExpiration = undefined; // Clear OTP expiration
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error in Reset Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Business Registration Route
router.post("/businessRegister", async (req, res) => {
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

// Business Login Route
router.post("/businessLogin", async (req, res) => {
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

module.exports = router;