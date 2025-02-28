const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/checkoutController");
const { protect } = require("../middleware/authMiddleware");

// ✅ Checkout Route
router.post("/checkout", protect, checkout);

module.exports = router;
