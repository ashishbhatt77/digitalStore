const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/checkoutController");
const businessAuth = require("../middleware/businessauth");

// ✅ Checkout Route
router.post("/checkout", businessAuth, checkout);

module.exports = router;