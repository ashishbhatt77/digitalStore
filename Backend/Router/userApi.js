require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cart = require("../model/cartSchema");
const validator = require("validator");
const UserData = require("../model/userSchema");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const router = express.Router();
router.use(cookieParser());

// Function to send reset email with OTP
const sendResetEmail = async (email, otp) => {
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
    subject: "Password Reset OTP",
    html: `<p>Your OTP for resetting the password is: <strong>${otp}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Registration Route
router.post("/userRegister", async (req, res) => {
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

    const newCart = new Cart({ user: newUser._id, items: [] });
    await newCart.save();

    newUser.cartId = newCart._id;
    await newUser.save();

    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Login Route
router.post("/userLogin", async (req, res) => {
  try {
    const { email, mobile, pass } = req.body;

    if ((!email && !mobile) || !pass) {
      return res.status(400).json({ message: "Email/Mobile and password are required." });
    }

    const query = email
      ? { email: email.trim() }
      : { mobile: mobile.toString().trim() };

    const user = await UserData.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid email/mobile or password." });
    }

    const isPasswordMatch = await bcrypt.compare(pass, user.pass);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    const token = jwt.sign({ userId: user._id }, process.env.UJWT_SECRET, { expiresIn: "1h" });

    if (!process.env.UJWT_SECRET) {
      console.error("JWT Secret is missing in environment variables.");
      return res.status(500).json({ message: "Server error. Please contact support." });
    }

    res.cookie("token", token, {
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.status(200).json({ message: "Login successful!" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// Forgot Password Route - To initiate the password reset with OTP
router.post("/userForgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await UserData.findOne({ email: email.trim() });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    // Generate a 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Set OTP expiration time (valid for 5 minutes)
    const otpExpiration = Date.now() + 300000; // 5 minutes expiration

    // Save OTP and expiration time in the user document
    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    // Send OTP via email
    await sendResetEmail(email, otp);

    res.status(200).json({ message: "OTP has been sent to your email." });
  } catch (error) {
    console.error("Error in Forgot Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

// Reset Password Route - To reset the password using the OTP
router.post("/userResetPassword", async (req, res) => {
  try {
    const { email, otp, newPassword, confirmNewPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmNewPassword) {
      return res.status(400).json({ message: "Email, OTP, new password, and confirmation password are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await UserData.findOne({
      email: email.trim(),
      otp: otp,
      otpExpiration: { $gt: Date.now() }, // OTP is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Reset the password and clear OTP
    user.pass = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Error in Reset Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;