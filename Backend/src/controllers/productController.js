const Product = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { name, category, price, compareAtPrice, stock, description, trackQuantity, status, tags } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : [];  

    if (!name || !category || !price || !stock || !description) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    const newProduct = new Product({ name, category, price, compareAtPrice, stock, description, images, trackQuantity, status, tags: tags ? tags.split(",") : [] });

    await newProduct.save();
    res.status(201).json({ message: "Product successfully added", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: "Error adding product", error: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, compareAtPrice, stock, description, trackQuantity, status, tags } = req.body;
    const images = req.files ? req.files.map((file) => file.path) : undefined;  
    
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, compareAtPrice, stock, description, images: images || existingProduct.images, trackQuantity, status, tags: tags ? tags.split(",") : existingProduct.tags },
      { new: true }
    );

    res.status(200).json({ message: "Product successfully updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product successfully deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };