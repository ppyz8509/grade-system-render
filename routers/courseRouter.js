const express = require("express");
const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");
const checkRole = require("../middlewares/checkRole");
const router = express.Router();

router.post("/courses", checkRole(['COURSE_INSTRUCTOR']), createCourse);
router.get("/courses", checkRole(['ADMIN', 'COURSE_INSTRUCTOR']), getAllCourses);
router.put("/courses/:id", checkRole(['COURSE_INSTRUCTOR']), updateCourse);
router.delete("/courses/:id", checkRole(['COURSE_INSTRUCTOR']), deleteCourse);

module.exports = router;
