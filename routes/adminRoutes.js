const express = require("express");
const { auth } = require("../middlewares/auth");
const { hasRole } = require("../middlewares/hasRole");
const adminCtrl = require("../controllers/adminController");

const router = express.Router();

router.use(auth);
router.use(hasRole("admin"));
router.get("/all-courses", adminCtrl.getAllCourses);
router.get("/all-instructors", adminCtrl.getAllInstructors);
router.get("/all-students", adminCtrl.getAllStudents);
router.put("/approve-course/:id", adminCtrl.approveCourse);
router.get("/dashboard-stats", adminCtrl.getDashboardStats);
router.put("/reject-course/:id", adminCtrl.rejectCourse);        
router.get("/pending-courses", adminCtrl.getPendingCourses);    
module.exports = router;
