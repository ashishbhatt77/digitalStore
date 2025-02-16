const express = require("express");
const Order = require("../model/orderSchema");
const Cart = require("../model/cartSchema");
const Product = require("../model/productSchema");
const businessAuth = require("../middleware/businessauth");

const router = express.Router();

// ✅ Checkout API (Place Order)
router.post("/checkout", businessAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalPrice = 0;
    for (const item of cart.items) {
      totalPrice += item.product.price * item.quantity;
      
      // ✅ Update stock
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    const newOrder = new Order({
      user: userId,
      products: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    await newOrder.save();

    // ✅ Clear user's cart
    await Cart.findOneAndDelete({ user: userId });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: "Error during checkout", error: err.message });
  }
});

module.exports = router;