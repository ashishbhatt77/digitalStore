const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, 
    },
    category: {
      type: String,
      required: true,
      trim: true, 
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"], 
    },
    img: {
      type: String, 
      default: null,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"], 
    },
    description: {
      type: String,
      required: true,
      trim: true, 
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
