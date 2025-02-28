const jwt = require("jsonwebtoken");
const User = require("../models/Users");

// User Authentication Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Admin Check Middleware
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

// Seller Check Middleware
const isSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller" && req.user.isApproved) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, seller approval required" });
  }
};

// Customer Check Middleware
const isCustomer = (req, res, next) => {
  if (req.user && req.user.role === "customer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied, customers only" });
  }
};

module.exports = { protect, isAdmin, isSeller, isCustomer };