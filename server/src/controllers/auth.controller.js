const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { sendOtpEmail } = require("../utils/mailer");

const UserSchema = require("../models/User");

let User;

function initUserModel(conn) {
  User = conn.model("User", UserSchema);
}

async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ msg: "User exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hash });

    res.json({ msg: "Registered", user });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ msg: "Wrong password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ msg: "Login success", token });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
}

async function sendOtp(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpHash = otpHash;
    user.otpExpiresAt = expires;
    await user.save();

    await sendOtpEmail(email, otp);

    res.json({ msg: "OTP sent" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function verifyOtp(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (!user.otpHash || !user.otpExpiresAt)
      return res.status(400).json({ msg: "OTP not requested" });

    if (new Date() > user.otpExpiresAt)
      return res.status(400).json({ msg: "OTP expired" });

    const ok = await bcrypt.compare(otp, user.otpHash);
    if (!ok) return res.status(400).json({ msg: "Invalid OTP" });

    user.isVerified = true;
    user.otpHash = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ msg: "Email verified" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}
module.exports = { register, login, sendOtp, verifyOtp, initUserModel };