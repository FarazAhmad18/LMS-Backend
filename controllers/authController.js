const User = require("../models/user");
const PendingUser = require("../models/pendingUser"); // new
console.log("PendingUser:", PendingUser);
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const { verificationTemplate } = require("../utils/emailTemplates");

const sendToken = (user, res, msg) => {
  const token = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.status(200).json({
    success: true,
    msg,
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email,password } = req.body;
let role = "student";
if (req.body.role === "instructor") {
  role = "instructor";
} else if (req.body.role && req.body.role !== "student") {
  return res.status(400).json({
    success: false,
    message: "Invalid role: you can only register as student or instructor"
  });
}

    // check if already registered
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email already registered" });

    // check if pending user already exists
    const pending = await PendingUser.findOne({ email });
    if (pending)
      return res.status(400).json({ success: false, message: "Verification already sent. Please check your email." });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create verification token & expiry
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationURL = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;
    console.log("Verification email sent to:", email, "URL:", verificationURL);

    // save in pending users
    await PendingUser.create({
      name,
      email,
      role,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry: Date.now() + 1000 * 60 * 60 // 1 hour
    });
    await sendEmail(email, "Verify Your Email", verificationTemplate(verificationURL));

    res.status(201).json({
      success: true,
      message: "Check your email for verification link."
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// VERIFY EMAIL
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.params.token;

    // find pending user
    const pending = await PendingUser.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!pending)
      return res.status(400).json({ success: false, message: "Invalid or expired verification link." });

    // create real user
    const user = await User.create({
      name: pending.name,
      email: pending.email,
      role: pending.role,
      password: pending.password
    });

    // delete pending user
    await PendingUser.deleteOne({ _id: pending._id });

    // optionally, log user in immediately:
    sendToken(user, res, "Email verified & registration complete");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// LOGIN 
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: "Incorrect password" });

    sendToken(user, res, "Login successful");
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
//Send OTP
const { generateOTP } = require("../utils/generateOTP");

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: "User not found" });

  const otp = generateOTP();
  user.otp = otp;
  user.otpExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes
  await user.save();

  await sendEmail(user.email, "Reset Your Password", `
    <h2>Reset Password</h2>
    <p>Your OTP is: <b>${otp}</b></p>
    <p>It expires in 10 minutes.</p>
  `);

  res.json({ success: true, message: "OTP sent to email" });
};
// Verify OTP and Update Password
exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);
  user.password = hashed;
  user.otp = null;
  user.otpExpiry = null;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};
// POST /api/auth/request-password-reset
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 mins
  await user.save();

  await sendEmail(email, "Password Reset OTP", `<p>Your OTP is: <b>${otp}</b></p>`);
  res.json({ success: true, message: "OTP sent to email" });
};

