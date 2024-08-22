const express = require("express");
const router = express.Router();
const {
createSection,
getSections,
getSectionById,
updateSection,
deleteSection,

createCourseIn,
getCourseIns,
getCourseInById,
updateCourseIn,
deleteCourseIn
} = require('../controllers/course_in_controller')

router.post("/createSection", createSection);
router.get("/getSections", getSections);
router.get("/getSectionById/sec_id", getSectionById);
router.put("/updateSection/sec_id", updateSection);
router.delete("/deleteSection/sec_id", deleteSection);

router.post("/createCourseIn", createCourseIn);
router.get("/getCourseIns", getCourseIns);
router.get("/getCourseInById/courseinstructor_id", getCourseInById);
router.put("/updateCourseIn/courseinstructor_id", updateCourseIn);
router.delete("/deleteCourseIn/courseinstructor_id", deleteCourseIn);

module.exports = router; 