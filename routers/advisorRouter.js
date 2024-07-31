const express = require("express");
const router = express.Router();
const { 
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentByRoom,
    updateStudent,
    deleteStudent,
} = require ("../controllers/advisorController");


const checkRole = require("../middlewares/checkRole");
//, checkRole(['COURSE_INSTRUCTOR']) เช็คโรล เก็บไว้ใช้ตอนทำ login advice เสร้จsdf


router.post("/createStudent",createStudent);
router.get("/getAllStudents", getAllStudents);
router.get("/getStudentById/:S_id", getStudentById);
router.get("/getStudentByRoom/:room", getStudentByRoom);
router.put("/updateStudent/:S_id", updateStudent);
router.delete("/deleteStudent/:S_id", deleteStudent);

//dont fis











module.exports = router;