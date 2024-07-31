const express = require("express");
const router = express.Router();
const { 
    createStudent,
    getStudent,
    getStudentById,
    getStudentByRoom,
    getStudentByYear,
    updateStudent,

    createStudentPlan,
    updateStudentPlan,
    deleteStudent,
} = require ("../controllers/advisorController");


const checkRole = require("../middlewares/checkRole");
//, checkRole(['COURSE_INSTRUCTOR']) เช็คโรล เก็บไว้ใช้ตอนทำ login advice เสร้จ


router.post("/createStudent",createStudent);
router.get("/getStudent", checkRole(['ADVISOR']), getStudent);
router.get("/getStudentById/:id", checkRole(['ADVISOR']), getStudentById);
router.get("/getStudentByRoom/:room", checkRole(['ADVISOR']), getStudentByRoom);
router.get("/getStudentByYear/:year", checkRole(['ADVISOR']), getStudentByYear);
router.put("/updateStudent/:id", checkRole(['ADVISOR']), updateStudent);

router.post("/createStudentPlan", createStudentPlan);

router.put("/updateStudentPlan/:id", updateStudentPlan);

router.delete("/deleteStudent/:S_id/:S_username", deleteStudent);




module.exports = router;