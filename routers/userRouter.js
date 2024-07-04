const express = require("express");
const router = express.Router();
const {
  createUser,
  getallUser,
  updateUser,
  deleteUser,
  createCourseInstructor,
  updateCourseInstructor,
  deleteCourseInstructor,
  getAllCourseInstructors
} = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");


///admin zone
router.post("/createUser", createUser);
router.get("/getallUser", getallUser);
router.put("/updateUser/:id", checkRole(['ADMIN']), updateUser);
router.delete("/deleteUser/:id", checkRole(['ADMIN']), deleteUser);





router.post("/createCourseInstructor", checkRole(['ADMIN']), createCourseInstructor);
router.get("/getAllCourseInstructors", checkRole(['ADMIN']), getAllCourseInstructors);
router.put("/updateCourseInstructor/:id", checkRole(['ADMIN']), updateCourseInstructor);
router.delete("/deleteCourseInstructor/:id", checkRole(['ADMIN']), deleteCourseInstructor);


module.exports = router;



