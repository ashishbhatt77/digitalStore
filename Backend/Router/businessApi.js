require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/businessUserSchema");
const nodemailer = require("nodemailer");
const router = express.Router();

const sendRegisterOtpEmail = async (email, otp) => {
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
    subject: "Business Registration - OTP Verification",
    html: `<p>Dear User,</p>
           <p>Thank you for registering your business with us! Please use the following OTP to complete your registration process:</p>
           <h3 style="color: #4CAF50;">${otp}</h3>
           <p>This OTP is valid for 5 minutes. Please enter it on the registration page to proceed.</p>
           <p>If you did not request this, please ignore this email.</p>
           <p>Best Regards,</p>
           <p>Your Business Registration Team</p>`,
  };

  await transporter.sendMail(mailOptions);
};

const sendResetPasswordOtpEmail = async (email, otp) => {
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
    subject: "Password Reset - OTP Verification",
    html: `<p>Dear User,</p>
           <p>You have requested to reset your password. Please use the following OTP to reset your password:</p>
           <h3 style="color: #FF6347;">${otp}</h3>
           <p>This OTP is valid for 5 minutes. Please enter it on the password reset page to proceed.</p>
           <p>If you did not request this, please ignore this email.</p>
           <p>Best Regards,</p>
           <p>Your Support Team</p>`,
  };

  await transporter.sendMail(mailOptions);
};

let tempUserStore = {};

router.post("/businessRegister", async (req, res) => {
  try {
    let { name, location, email, category, businessName, registrationNumber, registrationAuthority, registrationDate, directorName, contactPersonName, contactPersonEmail, contactPersonDesignation, contactPersonMobile, password, confirmPassword } = req.body;

    email = email?.trim()?.toLowerCase() || "";
    contactPersonEmail = contactPersonEmail?.trim()?.toLowerCase() || "";
    contactPersonMobile = contactPersonMobile?.trim() || "";

    if (!name || !location || !email || !category || !businessName || !registrationNumber || !registrationAuthority || !registrationDate || !directorName || !contactPersonName || !contactPersonEmail || !contactPersonDesignation || !contactPersonMobile || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { contactPersonMobile }] });
    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email ? "Email is already registered. Please login." : "Mobile number is already in use.",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiration = Date.now() + 300000;

    tempUserStore[contactPersonEmail] = {
      name, location, email, category, businessName, registrationNumber, registrationAuthority, registrationDate, directorName, contactPersonName, contactPersonEmail, contactPersonDesignation, contactPersonMobile,
      password: await bcrypt.hash(password, 10),
      otp, otpExpiration,
    };

    await sendRegisterOtpEmail(contactPersonEmail, otp);

    res.status(200).json({ message: "OTP has been sent to your email for verification." });
  } catch (error) {
    console.error("Error in Business Registration:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/verifyOtp", async (req, res) => {
  try {
    const { otp, email } = req.body;

    if (!otp || !email) {
      return res.status(400).json({ message: "OTP and email are required." });
    }

    const tempUser = tempUserStore[email.trim().toLowerCase()];
    if (!tempUser) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    if (tempUser.otp !== otp || tempUser.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const newUser = new User({ ...tempUser, status: "active" });
    await newUser.save();

    delete tempUserStore[email];
    res.status(200).json({ message: "OTP verified successfully. Registration complete." });
  } catch (error) {
    console.error("Error in OTP Verification:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

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

    const token = jwt.sign({ userId: user._id }, process.env.BJWT_SECRET);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in Business Login:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/businessUser/forgotPassword", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ contactPersonEmail: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString(); 
    const otpExpiration = Date.now() + 300000; 

    user.otp = otp;
    user.otpExpiration = otpExpiration;
    await user.save();

    await sendResetPasswordOtpEmail(email, otp);

    res.status(200).json({ message: "OTP has been sent to your email." });

  } catch (error) {
    console.error("Error in Forgot Password:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
});

router.post("/businessUser/resetPassword", async (req, res) => {
  try {
    const { otp, newPassword, confirmNewPassword, email } = req.body;

    if (!otp || !newPassword || !confirmNewPassword || !email) {
      return res.status(400).json({ message: "OTP, new password, and email are required." });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ contactPersonEmail: email.trim().toLowerCase() });

    if (!user) {
      return res.status(400).json({ message: "No user found with this email." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    if (user.otpExpiration < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
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