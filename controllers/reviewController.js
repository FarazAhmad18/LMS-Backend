const Review = require("../models/Reviews");

exports.addReview = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const existing = await Review.findOne({ course: courseId, user: req.user.id });
    if (existing) {
      return res.status(400).json({ success: false, message: "You already reviewed this course" });
    }
    const review = await Review.create({
      course: courseId,
      user: req.user.id,
      rating,
      comment
    });
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCourseReviews = async (req, res) => {
  try {
    const { courseId } = req.params;
    const reviews = await Review.find({ course: courseId }).populate("user", "name");
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
