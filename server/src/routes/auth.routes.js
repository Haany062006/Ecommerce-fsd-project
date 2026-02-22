const router = require("express").Router();
const { register, login, sendOtp, verifyOtp } = require("../controllers/auth.controller");

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;