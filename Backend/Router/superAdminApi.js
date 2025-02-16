const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const businessData = require("../model/businessUserSchema");

router.post("/superadmin", async (req, res) => {
  try {
    const { email, pass } = req.body;

    if (email === process.env.ADMIN_EMAIL && pass === process.env.ADMIN_PASS) {
      const businessUserData = await businessData.find();

      const token = jwt.sign({ userId: user._id }, process.env.SJWT_SECRET, {
        expiresIn: "1h",
      });

      return res.status(200).json({
        status: 200,
        message: "Login successful",
        data: businessUserData,
      });
    }

    return res.status(400).json({ message: "Invalid email or password" });
  } catch (e) {
    console.error("Superadmin login error:", e);
    return res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
