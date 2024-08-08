const express = require("express");
const router = express.Router();
const { 
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
} = require ("../controllers/studentController");

router.post("/createStudent",createStudent)
router.get("/getStudents",getStudents);
router.get("/getStudentById/:student_id",getStudentById);
router.put("/updateStudent/:student_id",updateStudent);
router.delete("/deleteStudent/:student_id",deleteStudent);

module.exports = router;