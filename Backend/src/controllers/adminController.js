const User = require('../models/userModel');
const Seller = require('../models/sellerModel');
const Order = require('../models/orderModel');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const approveSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        seller.approved = true;
        await seller.save();

        res.json({ success: true, message: "Seller Approved", seller });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const rejectSeller = async (req, res) => {
    try {
        const seller = await Seller.findById(req.params.id);
        if (!seller) return res.status(404).json({ message: "Seller not found" });

        await Seller.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Seller Rejected & Removed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "User Deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = status; // Pending → Processing → Delivered
        await order.save();

        res.json({ success: true, message: `Order updated to ${status}`, order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    approveSeller,
    rejectSeller,
    deleteUser,
    updateOrderStatus
};
