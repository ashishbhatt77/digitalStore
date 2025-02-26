const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

// ✅ Order Place kare
const placeOrder = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty. Cannot place order." });
    }

    let totalPrice = 0;
    const orderItems = cart.items.map((item) => {
      totalPrice += item.product.price * item.quantity;
      return { product: item.product._id, quantity: item.quantity };
    });

    const newOrder = new Order({ user: userId, products: orderItems, totalPrice });
    await newOrder.save();

    cart.items = [];
    await cart.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    console.error("Order placement error:", error);
    res.status(500).json({ message: "Error placing order", error: error.message });
  }
};

// ✅ User ke sare orders fetch kare
const getUserOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const orders = await Order.find({ user: req.user._id }).populate("products.product");
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};

// ✅ Ek single order fetch kare
const getOrderById = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized access. Please login." });
    }

    const order = await Order.findById(req.params.id).populate("products.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};

// ✅ Order status update kare (Admin/Business)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(req.params.id);
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
};

module.exports = {
  placeOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
};