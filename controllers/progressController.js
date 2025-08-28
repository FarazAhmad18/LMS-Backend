const Progress=require("../models/Progress")

const markLessonComplete=async(req,res)=>{
    try{
const {courseId,lessonId}=req.body
const studentId=req.user.id;
const progress=await Progress.findOne({
    course:courseId,
    student:studentId,
})
if(!progress)
{
    await Progress.create({
        course:courseId,
    student:studentId,
    completedLessons:[lessonId]
    })
  return res.json({ success: true, message: "Lesson marked complete (new progress created)" });
}
else{
    if(!progress.completedLessons.includes(lessonId))
    {
        progress.completedLessons.push(lessonId);
       await progress.save()
    }
}
 res.json({ success: true, message: "Lesson marked complete" })
    }
    catch(err){
   res.status(500).json({ success: false, error: err.message });
    }
}
module.exports = {
  markLessonComplete
};
