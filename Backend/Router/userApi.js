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

const sendRegistrationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Welcome! Verify Your Registration",
    html: `<p>Hi there,</p>
           <p>Thank you for registering. Please verify your registration using the following OTP: <strong>${otp}</strong></p>
           <p>The OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Function to send password reset OTP email
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
    html: `<p>Hi,</p>
           <p>We received a request to reset your password. Please use the following OTP to reset your password: <strong>${otp}</strong></p>
           <p>The OTP is valid for 5 minutes. If you did not request this, please ignore this email or contact support immediately.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

// Function to generate a 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Registration Route - Includes OTP Verification
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

    // Generate and send OTP to the user's email
    const otp = generateOTP();
    const otpExpiration = Date.now() + 300000; // OTP valid for 5 minutes

    // Create user without password initially and save OTP
    const user = new UserData({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      otp: otp,
      otpExpiration: otpExpiration,
      pass: "", // Temporarily storing password as an empty string
    });

    await user.save();

    // Send OTP to user's email for registration
    await sendRegistrationEmail(email, otp);

    res.status(200).json({ message: "Registration OTP has been sent to your email. Please verify." });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// OTP Verification Route - To complete registration after OTP verification
router.post("/verifyOTP", async (req, res) => {
  try {
    const { email, otp, pass, confirmpass } = req.body;

    if (!email || !otp || !pass || !confirmpass) {
      return res.status(400).json({ message: "Email, OTP, and password are required." });
    }

    if (pass !== confirmpass) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await UserData.findOne({
      email: email.trim(),
      otp: otp,
      otpExpiration: { $gt: Date.now() }, // Check if OTP is still valid
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    // Hash the user's password
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Update user data with hashed password and clear OTP details
    user.pass = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;

    await user.save();

    // Create a new Cart for the user
    const newCart = new Cart({ user: user._id, items: [] });
    await newCart.save();

    user.cartId = newCart._id;
    await user.save();

    res.status(200).json({ message: "Registration successful. Your account is now ready!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
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

    // Send OTP via email for password reset
    await sendResetEmail(email, otp);

    res.status(200).json({ message: "Password reset OTP has been sent to your email." });
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
      otpExpiration: { $gt: Date.now() }, 
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.pass = hashedPassword;
    user.otp = undefined;
    user.otpExpiration = undefined;

    await user.save();

    res.status(200).json({ message: "Password has been successfully reset. You can now log in with your new password." });
  } catch (error) {
    console.error("Error in Reset Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

module.exports = router;