const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: [String], required: true },
    businessName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    registrationDate: { type: Date, required: true },
    directorName: { type: String, required: true, trim: true },
    businessEmail: { type: String, required: true, lowercase: true, trim: true },
    businessDesignation: { type: String, required: true, trim: true },
    businessMobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    gstNumber : {type : String},
    approved: { type: Boolean, default: false }
  },
);

const User = mongoose.model("BusinessUser", UserSchema);
module.exports = User;