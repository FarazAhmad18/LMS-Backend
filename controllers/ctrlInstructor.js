const Course=require("../models/course")
const Lesson=require("../models/Lesson")

exports.createCourse = async (req, res) => {
  try {
    const instructorId = req.user.id;

    const approvedCount = await Course.countDocuments({
      instructor: instructorId,
      status: "approved"
    });

    const courseStatus = approvedCount < 3 ? "pending" : "approved";

    const course = await Course.create({
      ...req.body,
      instructor: instructorId,
      status: courseStatus,
    });

    res.status(201).json({
      success: true,
      message: `Course created with status: ${courseStatus}`,
      course
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getMyCourses=async(req,res)=>{
    try{
const courses=await Course.find({instructor:req.user.id})
res.status(200).json({
     success: true, courses 
})
    }
    catch(err){
  res.status(500).json({ success: false, message: "Server Error" });
    }
}

exports.updateCourse=async(req,res)=>{
    try{
        const {id}=req.params
const updatedCourse=await Course.findOneAndUpdate({_id:id,instructor:req.user.id},
    req.body,
    {new:true}
)
res.status(200).json({ success: true, updatedCourse,message:"course updated" });
    }
    catch(err){
    res.status(500).json({ success: false, message: "Server Error" });
    }
}

exports.deleteCourse=async(req,res)=>{
    try{
        const {id}=req.params;
        // console.log("Deleting course with ID:", id, "by user:", req.user.id);
const delCourse=await Course.findOneAndDelete({_id:id,instructor:req.user.id})
if (!delCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found or unauthorized",
      });
    }
res.status(200).json({ success: true, delCourse,message:"course deleted" });
    }
    catch(err)
    {
       res.status(500).json({ success: false, message: "Server Error" });
 
    }
}

exports.addLesson=async(req,res)=>
{try
    {const{courseId,title,content,videoUrl,order}=req.body
const newLesson=await Lesson.create({
course:courseId,
title,content,videoUrl,order
})
 res.status(201).json({ success: true, newLesson });
}
catch(err){
     res.status(500).json({ success: false, message: "Lesson upload failed", err });
}
}
