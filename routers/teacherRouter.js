const express = require("express");
const router = express.Router();
const {
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher
} = require('../controllers/teacherController')
const { authenticateToken, isAdmin }  = require("../middlewares/authorize");

router.post("/createTeacher",authenticateToken, isAdmin, createTeacher);
router.get("/getTeachers",authenticateToken, isAdmin, getTeachers);
router.get("/getTeacherById/teacher_id",authenticateToken, isAdmin, getTeacherById);
router.put("/updateTeacher/teacher_id",authenticateToken, isAdmin, updateTeacher);
router.delete("/deleteTeacher/teacher_id",authenticateToken, isAdmin, deleteTeacher);

module.exports = router; 