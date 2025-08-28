const Course = require("../models/course");
const Enrollment = require("../models/Enrollment");
const sendEmail = require("../utils/sendEmail");
const Progress = require("../models/Progress");
const mongoose = require("mongoose");
const stripe = require("../utils/stripe");

exports.courseEnrollments = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

exports.enrollInCourse = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }
    if (course.price > 0) {
      return res.status(400).json({ success: false, message: "Paid course: Use payment route" });
    }

    console.log("Checking if already enrolled:");
    console.log("User ID:", req.user.id);
    console.log("Course ID:", course._id);

    const exists = await Enrollment.findOne({ user: req.user.id, course: course._id });
    if (exists) {
      return res.status(400).json({ success: false, message: "Course already enrolled" });
    }
 const isForceEnroll = req.query.forceEnroll === "true";

    if (course.price > 0 && !isForceEnroll) {
      return res.status(400).json({ success: false, message: "Paid course: Use payment first" });
    }
    const newEnroll = await Enrollment.create({ user: req.user.id, course: course._id });

    const emailContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #2e86de;">Enrollment Confirmation</h2>
        <p>Dear Student,</p>
        <p>Congratulations! You have successfully enrolled in <strong>${course.title}</strong>.</p>
        <p>This course will help you gain essential skills and move forward in your learning journey.</p>
        <p>We wish you all the best! If you have any questions, feel free to reach out to our support team.</p>
        <br />
        <p>Best Regards,<br />LMS Team</p>
      </div>
    `;

    await sendEmail(req.user.email, "🎓 Enrollment Confirmed: " + course.title, emailContent);

    res.status(200).json({
      success: true,
      message: "Enrolled",
      enrollment: newEnroll
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Enrollment failed", err });
  }
};

exports.getProgress = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.courseId)) {
      return res.status(400).json({ success: false, message: "Invalid course ID" });
    }
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const progress = await Progress.findOne({ course: req.params.courseId, student: req.user.id });
    if (!progress) {
      return res.status(404).json({ success: true, completedLessons: [] });
    }

    res.status(200).json({
      success: true,
      completedLessons: progress.completedLessons
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// payment gateway
exports.createCheckoutSession = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course)
      return res.status(404).json({ success: false, message: "Course not found" });

    if (course.price === 0)
      return res.status(400).json({ success: false, message: "Course is free. Use enroll directly." });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: req.user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?courseId=${course._id}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${course._id}`,
      
      //Metadata added here for webhook use
      metadata: {
        courseId: course._id.toString(),
        userId: req.user.id
      }
    });

    res.status(200).json({ success: true, sessionUrl: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment session creation failed" });
  }
};
const { generateCertificate } = require("../utils/generateCertificate");
const User = require("../models/user");
exports.generateCertificateForCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate("instructor", "name");
    const student = await User.findById(req.user.id);

    if (!course || !student) {
      return res.status(404).json({ success: false, message: "Invalid student or course" });
    }

    const enrollment = await Enrollment.findOne({ user: req.user.id, course: req.params.courseId });
    if (!enrollment) {
      return res.status(400).json({ success: false, message: "You are not enrolled in this course" });
    }

    // generate certificate file and get path
    const certPath = await generateCertificate({
      studentName: student.name,
      courseTitle: course.title,
      instructorName: course.instructor.name,
    });

    // save in DB
    enrollment.certificateUrl = certPath;
    await enrollment.save();

    res.json({
      success: true,
      message: "Certificate generated successfully",
      certificateUrl: certPath
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Certificate generation failed" });
  }
};

exports.getMyEnrolledCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user.id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email" }
      });

    const courses = enrollments.map(e => e.course);

    res.status(200).json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch enrolled courses" });
  }
};