const express = require("express");
const router = express.Router();
const { addProduct, getProducts, updateProduct, deleteProduct } = require("../controllers/productController");
const upload = require("../middleware/multer");
const businessAuth = require("../middleware/businessauth");  

router.post("/product", businessAuth, upload.array("images", 5), addProduct);  
router.get("/product", businessAuth ,getProducts);  
router.put("/product/:id", businessAuth, upload.array("images", 5), updateProduct);  
router.delete("/product/:id", businessAuth, deleteProduct);  

module.exports = router;