const express = require("express");
const {
    getAllUsers,
    approveSeller,
    rejectSeller,
    deleteUser,
    updateOrderStatus
} = require("../controllers/adminController"); // Fixed import

const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.put("/approve-seller/:id", protect, isAdmin, approveSeller);
router.delete("/reject-seller/:id", protect, isAdmin, rejectSeller);
router.delete("/delete-user/:id", protect, isAdmin, deleteUser);
router.put("/update-order-status/:id", protect, isAdmin, updateOrderStatus);

module.exports = router;