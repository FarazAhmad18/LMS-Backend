const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  price: { type: Number, default: 0 },
  category: String,
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  // thumbnail: { type: String, default: "" },
});

module.exports = mongoose.model("Course", courseSchema);
