const express = require("express");
const {
    getAllUsers,
    approveSeller,
    rejectSeller,
    deleteUser,
    updateOrderStatus
} = require("../controllers/adminController"); // Fixed import

// const { protect, isAdmin } = require("../middleware/userauth");

const router = express.Router();

router.get("/users", getAllUsers);
router.put("/approve-seller/:id", approveSeller);
router.delete("/reject-seller/:id", rejectSeller);
router.delete("/delete-user/:id", deleteUser);
router.put("/update-order-status/:id", updateOrderStatus);

module.exports = router;
