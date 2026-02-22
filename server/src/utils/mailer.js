const nodemailer = require("nodemailer");

function makeTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

async function sendOtpEmail(to, otp) {
  const transporter = makeTransport();

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Your OTP for Ecommerce",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
  });
}

module.exports = { sendOtpEmail };