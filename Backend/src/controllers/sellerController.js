const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/sellerModel");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtpEmail = async (email, subject, otp, type) => {
  const messages = {
    registration: `<p>Dear User,</p><p>To complete your business registration, use the OTP:</p><h3 style='color: #4CAF50;'>${otp}</h3><p>Valid for 5 minutes.</p>`,
    resetPassword: `<p>Dear User,</p><p>Use this OTP to reset your password:</p><h3 style='color: #FF6347;'>${otp}</h3><p>Valid for 5 minutes.</p>`
  };

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html: messages[type] || "",
  });
};

let tempUserStore = {};

const registerBusinessUser = async (req, res) => {
  try {
    let { password, confirmPassword, email, ...userData } = req.body;
    email = email?.trim().toLowerCase();

    if (!email || !password || !confirmPassword || Object.values(userData).some(value => !value)) {
      return res.status(400).json({ message: "All fields are required." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    tempUserStore[email] = {
      userData: { ...userData, email, password: await bcrypt.hash(password, 10), approved: false },
      otp,
      otpExpiration: Date.now() + 300000,
    };

    await sendOtpEmail(email, "OTP Verification", otp, "registration");
    res.status(200).json({ message: "OTP sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const verifyBusinessUserOtp = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const tempUser = tempUserStore[email?.trim().toLowerCase()];
    if (!tempUser || tempUser.otp !== otp || Date.now() > tempUser.otpExpiration) return res.status(400).json({ message: "Invalid or expired OTP." });

    const newUser = new User({ ...tempUser.userData, status: "active" });
    await newUser.save();
    delete tempUserStore[email];
    res.status(200).json({ message: "Registration successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const loginBusinessUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });
    if (!user.approved) return res.status(403).json({ message: "Your account is not approved yet." });
    
    if (!(await bcrypt.compare(password, user.password))) return res.status(400).json({ message: "Invalid credentials." });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token, message: "Login successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const forgotPasswordBusinessUser = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.trim().toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found." });
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    tempUserStore[email] = { otp, otpExpiration: Date.now() + 300000 };
    await sendOtpEmail(email, "Reset Password OTP", otp, "resetPassword");
    res.status(200).json({ message: "OTP sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const resetPasswordBusinessUser = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const tempUser = tempUserStore[email?.trim().toLowerCase()];
    if (!tempUser || tempUser.otp !== otp || Date.now() > tempUser.otpExpiration) return res.status(400).json({ message: "Invalid or expired OTP." });
    await User.findOneAndUpdate({ email }, { password: await bcrypt.hash(newPassword, 10) });
    delete tempUserStore[email];
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

module.exports = {
  registerBusinessUser,
  verifyBusinessUserOtp,
  loginBusinessUser,
  forgotPasswordBusinessUser,
  resetPasswordBusinessUser,
  getUser,
  updateUser,
  deleteUser
};