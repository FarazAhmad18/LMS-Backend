const express = require("express");
const { auth } = require("../middlewares/auth");
const reviewCtrl = require("../controllers/reviewController");
const router = express.Router();

router.post("/add", auth, reviewCtrl.addReview);
router.get("/:courseId", reviewCtrl.getCourseReviews);

module.exports = router;
