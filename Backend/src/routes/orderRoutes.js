const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect, isSeller } = require("../middleware/authMiddleware");

router.post("/order", protect, placeOrder);
router.get("/orders", protect, getUserOrders);
router.get("/order/:id", protect, getOrderById);
router.put("/order/:id/status", protect, isSeller, updateOrderStatus);

module.exports = router;