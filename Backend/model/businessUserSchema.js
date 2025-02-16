const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: [String], required: true },
    businessName: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, trim: true },
    registrationAuthority: { type: String, required: true, trim: true },
    registrationDate: { type: Date, required: true },
    directorName: { type: String, required: true, trim: true },
    contactPersonName: { type: String, required: true, trim: true },
    contactPersonEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPersonDesignation: { type: String, required: true, trim: true },
    contactPersonMobile: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
  },
);

const User = mongoose.model("BusinessUser", UserSchema);
module.exports = User;
