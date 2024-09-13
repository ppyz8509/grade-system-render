const express = require("express");
const router = express.Router();
const { 
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require ("../controllers/studentController");
const { authenticateToken, isAdvisor }  = require("../middlewares/authorize");

router.post("/createStudent",authenticateToken, isAdvisor,createStudent)
router.get("/getStudents",getStudents);
router.get("/getStudentById/:student_id",getStudentById);
router.put("/updateStudent/:student_id",updateStudent);
router.delete("/deleteStudent/:student_id",authenticateToken, isAdvisor,deleteStudent);

module.exports = router;