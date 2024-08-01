const express = require("express");
const router = express.Router();

const { 
    createClassroom,
    getAllRoom,
    deleteRoom,
    createAdvisor,
    deleteAdvisor,
} = require('../controllers/course_in_controller')

router.post("/createClassroom", createClassroom);
router.post("/createAdvisor", createAdvisor);
router.get("/getAllRoom", getAllRoom);
router.delete("/deleteRoom/:roomname", deleteRoom);
router.delete("/deleteAdvisor/:Advisor_id", deleteAdvisor);

module.exports = router;