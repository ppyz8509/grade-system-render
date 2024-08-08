const express = require("express");
const router = express.Router();
const {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacherController')

router.post("/createTeacher", createTeacher);
router.get("/getTeachers", getTeachers);
router.get("/getTeacherById/teacher_id", getTeacherById);
router.put("/updateTeacher/teacher_id", updateTeacher);
router.delete("/deleteTeacher/teacher_id", deleteTeacher);

module.exports = router; 