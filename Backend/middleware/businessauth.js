const jwt = require("jsonwebtoken");

const businessAuth = (req, res, next) => {
  try {
    const token = req.cookies.auth_token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access. No token provided." });
    }

    // Verify token using Business JWT Secret
    const decoded = jwt.verify(token, process.env.BJWT_SECRET);
    req.user = decoded;

    // 🛑 Check if role is Business
    if (req.user.role !== "Business") {
      return res.status(403).json({ message: "Access denied. Business users only." });
    }

    next();
  } catch (error) {
    console.error("Business Auth Error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token. Please log in again." });
    }

    return res.status(500).json({ message: "Authentication error. Please try again." });
  }
};

module.exports = businessAuth;
