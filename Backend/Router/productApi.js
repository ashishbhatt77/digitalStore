const express = require("express");
const router = express.Router();
const Product = require("../model/productSchema");
const upload = require("../middleware/multer");
const businessAuth = require("../middleware/businessauth");

const cookieParser = require("cookie-parser");
router.use(cookieParser());

router.post("/product", businessAuth, upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, stock, description } = req.body;
    const img = req.file ? req.file.path : null;

    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required, including an image",
      });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      stock,
      description,
      img,
    });

    await newProduct.save();

    res.status(201).json({
      status: 201,
      message: "Product successfully added",
      product: newProduct,
    });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({
      status: 500,
      message: "Error adding product",
      error: err.message,
    });
  }
});

router.get("/product", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: 200,
      products,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      status: 500,
      message: "Error fetching products",
      error: err.message,
    });
  }
});

router.put("/product/:id", businessAuth, upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, description } = req.body;
    const img = req.file ? req.file.path : undefined;

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        price,
        stock,
        description,
        img: img || existingProduct.img,
      },
      { new: true }
    );

    res.status(200).json({
      status: 200,
      message: "Product successfully updated",
      product: updatedProduct,
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({
      status: 500,
      message: "Error updating product",
      error: err.message,
    });
  }
});

// ✅ Protected Product Deletion Route (Only Authenticated Users Can Delete)
router.delete("/product/:id", businessAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Product successfully deleted",
    });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({
      status: 500,
      message: "Error deleting product",
      error: err.message,
    });
  }
});

module.exports = router;