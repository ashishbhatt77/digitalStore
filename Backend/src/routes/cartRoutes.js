const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware"); // Ensure this middleware exists

router.post("/cart", protect, cartController.addToCart);
router.delete("/cart/:productId", protect, cartController.removeFromCart);
router.put("/cart", protect, cartController.updateCart);
router.get("/cart", protect, cartController.getUserCart);

module.exports = router;