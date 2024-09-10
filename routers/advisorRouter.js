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

router.post("/createStudent",createStudent);
router.get("/getAllStudents", getAllStudents);
router.get("/getStudentById/:S_id", getStudentById);
router.get("/getStudentByRoom/:room", getStudentByRoom);
router.put("/updateStudent/:S_id", updateStudent);
router.delete("/deleteStudent/:S_id", deleteStudent);

//dont fis











module.exports = router;