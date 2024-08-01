const express = require("express");
const router = express.Router();
const { 
    createTeacher,
    deleteTeacher,
    getAllTeachers,
    getTeacherById,
    updateTeacher,
} = require ("../controllers/adminController");



router.post("/createTeacher",createTeacher);
router.delete("/deleteTeacher/:T_id",deleteTeacher);
router.get("/getAllTeachers",getAllTeachers);
router.get("/getTeacherById/:T_id",getTeacherById);
router.put("/updateTeacher/:T_id",updateTeacher);


module.exports = router;