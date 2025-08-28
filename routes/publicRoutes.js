const express = require("express");
const router = express.Router();
const publicCtrl = require("../controllers/publicCtrl");

router.get("/courses/:id", publicCtrl.getCourseDetails);
router.get("/courses", publicCtrl.getPublicCourses); 
// router.get("/courses", publicCtrl.getAllCourses);
router.get("/search", publicCtrl.searchCourses);
module.exports = router;


