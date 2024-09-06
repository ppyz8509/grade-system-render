const express = require("express");
const router = express.Router();
const { 
    createAdmin,
    getAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,

    // Controller สำหรับ Teacher
    createTeacher,
    getTeachers,
    getTeacherById,
    updateTeacher,
    deleteTeacher,
} = require ("../controllers/adminController");

// Admin Routes
router.post("/createAdmin",createAdmin)
router.get("/getAdmins",getAdmins);
router.get("/getAdminById/:admin_id",getAdminById);
router.put("/updateAdmin/:admin_id",updateAdmin);
router.delete("/deleteAdmin/:admin_id",deleteAdmin);

// Teacher Routes
router.post("/createTeacher", createTeacher);
router.get("/getTeachers", getTeachers);
router.get("/getTeacherById/:teacher_id", getTeacherById);
router.put("/updateTeacher/:teacher_id", updateTeacher);
router.delete("/deleteTeacher/:teacher_id", deleteTeacher);

module.exports = router;