const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  try {
    const token = req.cookies.auth_token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    // Token verify karo
    const decoded = jwt.verify(token, process.env.SJWT_SECRET);
    req.user = decoded;

    // ✅ Admin role check karo
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next();
  } catch (error) {
    console.error("Admin Auth Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }

    return res.status(500).json({ message: "Authentication error. Please try again." });
  }
};

module.exports = adminAuth;