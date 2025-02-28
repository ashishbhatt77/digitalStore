const express = require("express");
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../middleware/multer");
const { protect, isSeller } = require("../middleware/authMiddleware");  

router.post("/product", protect, isSeller, upload.array("images", 5), addProduct);  
router.get("/product", protect, isSeller, getProducts);  
router.put("/product/:id", protect, isSeller, upload.array("images", 5), updateProduct);  
router.delete("/product/:id", protect, isSeller, deleteProduct);  

module.exports = router;