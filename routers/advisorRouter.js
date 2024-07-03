const express = require("express");
const router = express.Router();
const { createStudent,getStudent,getStudentById } = require ("../controllers/advisorController");

router.post("/createStudent", createStudent);
router.get("/getStudent", getStudent);
router.get("/getStudentById/:id", getStudentById);

module.exports = router;