const express = require("express");
const customerController = require("../controllers/authController");
const { protect, isCustomer } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", customerController.registerCustomer);
router.post("/verify-otp", customerController.verifyOtp);
router.post("/login", customerController.loginCustomer);
router.post("/forgot-password", customerController.forgotPassword);
router.post("/reset-password", customerController.resetPassword);

router.get("/:id", protect, isCustomer, customerController.getCustomerById);
router.put("/:id", protect, isCustomer, customerController.updateCustomer);
router.delete("/:id", protect, isCustomer, customerController.deleteCustomer);

module.exports = router;