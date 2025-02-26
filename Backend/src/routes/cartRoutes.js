const express = require("express");
const router = express.Router();
const {
  addToCart,
  removeFromCart,
  updateCart,
  getUserCart,
} = require("../controllers/cartController");

const userAuth = require("../middleware/userauth");

// ✅ Cart Routes
router.post("/cart", userAuth, addToCart);
router.delete("/cart/:productId", userAuth, removeFromCart);
router.put("/cart", userAuth, updateCart);
router.get("/cart", userAuth, getUserCart);

module.exports = router;
