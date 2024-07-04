const express = require("express");
const router = express.Router();
const { createStudent,getStudent,getStudentById,getStudentByRoom,getStudentByYear } = require ("../controllers/advisorController");

router.post("/createStudent", createStudent);
router.get("/getStudent", getStudent);
router.get("/getStudentById/:id", getStudentById);
router.get("/getStudentByRoom/:room", getStudentByRoom);
router.get("/getStudentByYear/:year", getStudentByYear);

module.exports = router;