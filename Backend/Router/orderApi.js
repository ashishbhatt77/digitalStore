const express = require("express");
const router = express.Router();
const Order = require("../model/orderSchema");
const Cart = require("../model/cartSchema");
const businessAuth = require("../middleware/businessauth");
const userAuth = require("../middleware/userauth");

// ✅ 1. Order Place karne ka API
router.post("/order", userAuth, async (req, res) => {
  try {
    // 🛠️ Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const userId = req.user._id;

    // 🛒 Cart fetch karo
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Cannot place order." });
    }

    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      totalPrice += item.product.price * item.quantity;
      return { product: item.product._id, quantity: item.quantity };
    });

    // ✅ Order save karo
    const newOrder = new Order({
      user: userId,
      products: orderItems,
      totalPrice,
    });

    await newOrder.save();

    // 🛒 Order ke baad cart empty kar do
    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
});

// ✅ 2. User ke sare orders fetch karne ka API
router.get("/orders", userAuth, async (req, res) => {
  try {
    // 🛠️ Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const userId = req.user._id;
    const orders = await Order.find({ user: userId }).populate("products.product");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
});

// ✅ 3. Ek single order fetch karne ka API
router.get("/order/:id", userAuth, async (req, res) => {
  try {
    // 🛠️ Check if user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const { id } = req.params;
    const order = await Order.findById(id).populate("products.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
});

// ✅ 4. Admin order status update karega
router.put("/order/:id/status", businessAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // 🛠️ Status validation
    if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 🛠️ Check if order exists
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status", error: error.message });
  }
});

module.exports = router;