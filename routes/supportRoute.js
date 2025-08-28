const express = require("express");
const router = express.Router();
const { contactSupport } = require("../controllers/supportController");
const { auth } = require("../middlewares/auth"); 
router.post("/contact", auth, contactSupport);

module.exports = router;
