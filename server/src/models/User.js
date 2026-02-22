const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,

    isVerified: { type: Boolean, default: false },

    otpHash: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = userSchema;