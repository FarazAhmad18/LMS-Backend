const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth");
const userCtrl = require("../controllers/userCtrl");

router.get("/profile", auth, userCtrl.getProfile);
router.put("/update-profile", auth, userCtrl.updateProfile);

module.exports = router;
