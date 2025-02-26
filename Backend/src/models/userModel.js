const mongoose= require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  pass: { type: String, required: true, minlength: 6 },
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
    default: null
  },
}, { timestamps: true });

const UserData = mongoose.model("UserData", userSchema);
module.exports = UserData;