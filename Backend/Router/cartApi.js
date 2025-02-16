const express = require("express");
const Cart = require("../model/cartSchema");
const Product = require("../model/productSchema");
const userauth = require("../middleware/userauth");

const router = express.Router();

// ✅ Add Item to Cart
router.post("/cart", userauth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id; // Auth middleware se mil raha h

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity are required" });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.status(200).json({ message: "Product added to cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error adding to cart", error: err.message });
  }
});

// ✅ Remove Item from Cart
router.delete("/cart/:productId", userauth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();

    res.status(200).json({ message: "Product removed from cart", cart });
  } catch (err) {
    res.status(500).json({ message: "Error removing product", error: err.message });
  }
});

// ✅ Update Cart Item Quantity
router.put("/cart", userauth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user._id;

    if (!productId || !quantity) {
      return res.status(400).json({ message: "Product and quantity are required" });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (!existingItem) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    existingItem.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (err) {
    res.status(500).json({ message: "Error updating cart", error: err.message });
  }
});

// ✅ Get User's Cart
router.get("/cart", userauth, async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: "Error fetching cart", error: err.message });
  }
});

module.exports = router;
