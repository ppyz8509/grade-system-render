const express = require("express");
const router = express.Router();

const { createClassroom,getAllRoom } = require('../controllers/course_in_controller')

router.post("/createClassroom", createClassroom);
router.get("/getAllRoom", getAllRoom);

module.exports = router;