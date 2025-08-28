const Course = require("../models/course");
const User = require("../models/user");
const Enrollment = require("../models/Enrollment");

exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" }).select("-password");
    res.json({ success: true, instructors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" }).select("-password");
    res.json({ success: true, students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.approveCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.status = "approved";
    await course.save();

    // Count instructor's approved courses
    const approvedCount = await Course.countDocuments({
      instructor: course.instructor,
      status: "approved"
    });

    // Auto-promote if >= 3 approved courses
    if (approvedCount >= 3 && course.instructor) {
      await User.findByIdAndUpdate(course.instructor, { autoApproved: true });
    }

    // Add notification
    if (course.instructor) {
      await User.findByIdAndUpdate(
        course.instructor,
        { $push: { notifications: { message: `Your course "${course.title}" has been approved.` } } }
      );
    }

    res.json({ success: true, message: "Course approved", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.rejectCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    course.status = "rejected";
    await course.save();

    // Add rejection notification
    if (course.instructor) {
      await User.findByIdAndUpdate(
        course.instructor,
        { $push: { notifications: { message: `Your course "${course.title}" has been rejected.` } } }
      );
    }

    res.json({ success: true, message: "Course rejected", course });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getPendingCourses = async (req, res) => {
  try {
    const pendingCourses = await Course.find({ status: "pending" })
      .populate("instructor", "name email");
    res.json({ success: true, pendingCourses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const students = await User.countDocuments({ role: "student" });
    const instructors = await User.countDocuments({ role: "instructor" });
    const courses = await Course.countDocuments();
    const enrollments = await Enrollment.countDocuments();

    res.json({
      success: true,
      stats: { students, instructors, courses, enrollments }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
