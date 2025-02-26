const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// ✅ Checkout API (Place Order)
const checkout = async (req, res) => {
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
};

// 📌 **Export all functions from here**
module.exports = { checkout };