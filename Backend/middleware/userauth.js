const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Token from cookies or Authorization header
  const token = req.cookies.auth_token || req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized access: No token provided" });
  }

  try {
    const secretKey = process.env.UJWT_SECRET;
    if (!secretKey) {
      return res.status(500).json({ message: "Server error: JWT secret not configured" });
    }

    // Verify token
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;