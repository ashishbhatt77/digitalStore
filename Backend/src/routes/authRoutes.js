const express = require("express");
const customerController = require("../controllers/authController");
const router = express.Router();

router.post("/register", customerController.registerCustomer);
router.post("/verify-otp", customerController.verifyOtp);
router.post("/login", customerController.loginCustomer);
router.post("/forgot-password", customerController.forgotPassword);
router.post("/reset-password", customerController.resetPassword);
router.get("/:id", customerController.getCustomerById);
router.put("/:id", customerController.updateCustomer);
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
