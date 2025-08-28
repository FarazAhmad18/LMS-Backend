const Exam=require("../models/Exam")
const Course=require("../models/course")
const Attempt = require("../models/Attempt");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/user")
exports.createExam=async(req,res)=>{
    try{
        const{courseId,questions,passingScore}=req.body
        const userId=req.user.id
const course=await Course.findById(courseId)
        if(!course) return res.json({success:false,message:"Course not found"})
        if(userId!==course.instructor.toString())
        {
               return res.status(403).json({ success: false, message: "Unauthorized: You are not the instructor of this course" })
        }
        const exam=await Exam.create({
            course:courseId,
            questions,
            passingScore
        })
        return res.status(200).json({
            success:true,
            message:"Exam created",
            exam
        })
    }
    catch(err){
 res.status(500).json({ success: false, error: err.message });
    }
}

const { generateCertificate } = require("../utils/generateCertificate");
const fs = require("fs");

exports.attemptExam = async (req, res) => {
  try {
    const { examId, answers } = req.body;
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(400).json({ success: false, message: "Exam Not Found" });

    const courseId = exam.course;
    const course = await Course.findById(courseId).populate("instructor", "name");
    if (!course) return res.status(400).json({ success: false, message: "No course for this exam exist" });

    const existingAttempt = await Attempt.findOne({ student: req.user.id, exam: exam.id });
    if (existingAttempt) {
      return res.status(400).json({ success: false, message: "You have already attempted this exam." });
    }

    let score = 0;
    exam.questions.forEach((question, index) => {
      if (question.correctAnswer === answers[index]) score++;
    });
    const percentage = (score / exam.questions.length) * 100;
    const passed = percentage >= 50;

    const attempt = await Attempt.create({
      student: req.user.id,
      exam: examId,
      answers,
      score: percentage,
      course: courseId,
      passed
    });

    // ✅ Auto-generate certificate if passed
    let certificatePath = null;
    if (passed) {
      const student = await User.findById(req.user.id);
      certificatePath = await generateCertificate(student, course);
    }

    // Send email with result
    await sendEmail(req.user.email, "Exam Score", `
      <h2>Result: ${passed ? "Passed" : "Failed"}</h2>
      <p>You scored ${percentage.toFixed(2)}%</p>
      ${passed ? "<p>Your certificate has been generated 🎓</p>" : ""}
    `);

    return res.status(200).json({
      success: true,
      message: "Exam Submitted",
      passed,
      score: percentage,
      certificate: certificatePath // send path if needed
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};
