const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

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

module.exports = { register, login, initUserModel };