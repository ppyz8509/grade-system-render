const express = require("express");
const router = express.Router();
const {
createCourseIn,
getCourseIns,
getCourseInById,
updateCourseIn,
deleteCourseIn
} = require('../controllers/course_in_controller')
const { authenticateToken, isAdmin }  = require("../middlewares/authorize");

router.post("/createCourseIn",authenticateToken, isAdmin, createCourseIn);
router.get("/getCourseIns", getCourseIns);
router.get("/getCourseInById/:courseinstructor_id", getCourseInById);
router.put("/updateCourseIn/:courseinstructor_id",authenticateToken, isAdmin, updateCourseIn);
router.delete("/deleteCourseIn/:courseinstructor_id",authenticateToken, isAdmin, deleteCourseIn);

module.exports = router; 