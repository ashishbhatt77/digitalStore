const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Cart = require("../models/cartModel");
const validator = require("validator");
const Customer = require("../models/userModel");
const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({ from: process.env.EMAIL_USER, to: email, subject, html });
};

const registerCustomer = async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    if (!name || !email || !mobile) return res.status(400).json({ message: "All fields are required." });
    if (!validator.isEmail(email.trim())) return res.status(400).json({ message: "Invalid email." });
    if (!validator.isMobilePhone(mobile.toString().trim(), "en-IN") || mobile.length !== 10)
      return res.status(400).json({ message: "Invalid mobile number." });
    
    const existingCustomer = await Customer.findOne({ $or: [{ email }, { mobile }] });
    if (existingCustomer) return res.status(400).json({ message: "Customer already exists." });

    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiration = Date.now() + 300000;
    const tempCustomer = { name, email, mobile, otp, otpExpiration };
    await sendEmail(email, "Verify Your Registration", `<p>Your OTP: <strong>${otp}</strong></p>`);
    res.status(200).json({ message: "OTP sent. Please verify.", tempCustomer });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { name, email, mobile, otp, pass, confirmpass } = req.body;
    if (!otp || !pass || !confirmpass) return res.status(400).json({ message: "All fields are required." });
    if (pass !== confirmpass) return res.status(400).json({ message: "Passwords do not match." });
    
    const otpCustomer = await Customer.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
    if (!otpCustomer) return res.status(400).json({ message: "Invalid or expired OTP." });
    
    const hashedPassword = await bcrypt.hash(pass, 10);
    const newCustomer = new Customer({ name, email, mobile, pass: hashedPassword });
    await newCustomer.save();
    
    const newCart = new Cart({ user: newCustomer._id, items: [] });
    await newCart.save();
    newCustomer.cartId = newCart._id;
    await newCustomer.save();
    
    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { emailOrMobile, pass } = req.body;
    const customer = await Customer.findOne({ $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] });
    if (!customer || !(await bcrypt.compare(pass, customer.pass)))
      return res.status(400).json({ message: "Invalid credentials." });
    
    const token = jwt.sign({ userId: customer._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ message: "Login successful!", token });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer) return res.status(400).json({ message: "Customer not found." });
    
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    customer.otp = otp;
    customer.otpExpiration = Date.now() + 300000;
    await customer.save();
    
    await sendEmail(email, "Password Reset OTP", `<p>Your OTP: <strong>${otp}</strong></p>`);
    res.status(200).json({ message: "OTP sent." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const customer = await Customer.findOne({ email, otp, otpExpiration: { $gt: Date.now() } });
    if (!customer) return res.status(400).json({ message: "Invalid or expired OTP." });
    
    customer.pass = await bcrypt.hash(newPassword, 10);
    await customer.save();
    res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
};

const getCustomerById = async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  res.json(customer);
};

const updateCustomer = async (req, res) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ message: "Customer updated successfully", updatedCustomer });
};

const deleteCustomer = async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Customer deleted successfully" });
};

module.exports = {
  registerCustomer,
  verifyOtp,
  loginCustomer,
  forgotPassword,
  resetPassword,
  getCustomerById,
  updateCustomer,
  deleteCustomer
};