const express=require("express")
const router=express.Router()
const { registerValidator, loginValidator } = require("../validators/authValidators");
const { validationResult } = require("express-validator");

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

const{register,login,verifyEmail,forgotPassword, resetPassword,requestPasswordReset}=require("../controllers/authController")

router.post("/register",registerValidator,runValidation,register)
router.post("/login",loginValidator,runValidation,login)
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
module.exports=router;
