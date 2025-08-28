const express=require("express")
const {auth}=require("../middlewares/auth")
const {hasRole}=require("../middlewares/hasRole")
const ctrlInstructor=require("../controllers/ctrlInstructor")
const { createExam } = require("../controllers/examController");
const router=express.Router()

router.use(auth)
router.use(hasRole("instructor"))

router.post("/create-course",ctrlInstructor.createCourse)
router.get("/get-course",ctrlInstructor.getMyCourses)
router.put("/update-course/:id",ctrlInstructor.updateCourse)
router.delete("/delete-course/:id",ctrlInstructor.deleteCourse)
router.post("/add-lesson",ctrlInstructor.addLesson)

router.post("/create-exam", createExam);
module.exports=router