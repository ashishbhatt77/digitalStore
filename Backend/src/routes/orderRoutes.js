const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const userAuth = require("../middleware/userauth");
const businessAuth = require("../middleware/businessauth");

router.post("/order", userAuth, placeOrder);
router.get("/orders", userAuth, getUserOrders);
router.get("/order/:id", userAuth, getOrderById);
router.put("/order/:id/status", businessAuth, updateOrderStatus);

module.exports = router;