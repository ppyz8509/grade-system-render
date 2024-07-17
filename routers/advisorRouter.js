const express = require("express");
const router = express.Router();
const { 
    createStudent,
    getStudent,
    getStudentById,
    getStudentByRoom,
    getStudentByYear,
    updateStudent 
} = require ("../controllers/advisorController");


//const checkRole = require("../middlewares/checkRole");
//, checkRole(['COURSE_INSTRUCTOR']) เช็คโรล เก็บไว้ใช้ตอนทำ login advice เสร้จ


router.post("/createStudent", createStudent);
router.get("/getStudent", getStudent);
router.get("/getStudentById/:id", getStudentById);
router.get("/getStudentByRoom/:room", getStudentByRoom);
router.get("/getStudentByYear/:year", getStudentByYear);
router.put("/updateStudent/:id", updateStudent);

module.exports = router;