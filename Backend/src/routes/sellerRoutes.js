require("dotenv").config();
const express = require("express");
const router = express.Router();
const businessUserController = require("../controllers/sellerController");

router.post("/BusinessRegister", businessUserController.registerBusinessUser);
router.post("/BusinessUserVerifyOtp", businessUserController.verifyBusinessUserOtp);
router.post("/BusinessLogin", businessUserController.loginBusinessUser);
router.post("/BusinessForgotPassword", businessUserController.forgotPasswordBusinessUser);
router.post("/BusinessResetPassword", businessUserController.resetPasswordBusinessUser);

router.route("/BusinessUser/:id")
  .get(businessUserController.getUser)
  .put(businessUserController.updateUser)
  .delete(businessUserController.deleteUser);

module.exports = router;