const express = require("express");
const router = express.Router();
const {
  createUser,
  getallUser,
  createAdvisor,
  updateAdvisor,
  deleteAdvisor,
  getAllAdvisors,
  createCourseInstructor,
  updateCourseInstructor,
  deleteCourseInstructor,
  getAllCourseInstructors
} = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");
//const authenticate = require("../middlewares/authenticate");
//router.use(authenticate); // Ensure all routes are authenticated

///admin sone
router.post("/createUser", createUser);
router.get("/getallUser", getallUser);
router.post("/createAdvisor", checkRole(['ADMIN']), createAdvisor);
router.get("/getAllAdvisors", checkRole(['ADMIN']), getAllAdvisors);
router.put("/updateAdvisor/:id", checkRole(['ADMIN']), updateAdvisor);
router.delete("/deleteAdvisor/:id", checkRole(['ADMIN']), deleteAdvisor);
router.post("/createCourseInstructor", checkRole(['ADMIN']), createCourseInstructor);
router.get("/getAllCourseInstructors", checkRole(['ADMIN']), getAllCourseInstructors);
router.put("/updateCourseInstructor/:id", checkRole(['ADMIN']), updateCourseInstructor);
router.delete("/deleteCourseInstructor/:id", checkRole(['ADMIN']), deleteCourseInstructor);


module.exports = router;



