require("dotenv").config();
const express = require("express");
const router = express.Router();
const businessUserController = require("../controllers/sellerController");
const { protect, isSeller } = require("../middleware/authMiddleware");

router.post("/BusinessRegister", businessUserController.registerBusinessUser);
router.post("/BusinessUserVerifyOtp", businessUserController.verifyBusinessUserOtp);
router.post("/BusinessLogin", businessUserController.loginBusinessUser);
router.post("/BusinessForgotPassword", businessUserController.forgotPasswordBusinessUser);
router.post("/BusinessResetPassword", businessUserController.resetPasswordBusinessUser);

router.route("/BusinessUser/:id")
  .get(protect, isSeller, businessUserController.getUser)
  .put(protect, isSeller, businessUserController.updateUser)
  .delete(protect, isSeller, businessUserController.deleteUser);

module.exports = router;