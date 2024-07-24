const express = require("express");
const router = express.Router();
const {
  createMajor,
  getallMajor,
  getMajorById,
  updateMajor,
  deleteMajor,
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  createCourse,
  getAllCourses,
  updateCourse ,
  deleteCourse 
} = require("../controllers/majorController");
const checkRole = require("../middlewares/checkRole");





///major
router.post("/createMajor", checkRole(['COURSE_INSTRUCTOR']),createMajor);
router.get("/getallMajor",checkRole(['COURSE_INSTRUCTOR']),getallMajor)
router.get("/getMajorById/:id",checkRole(['COURSE_INSTRUCTOR']),getMajorById)
router.put("/updateMajor/:id",checkRole(['COURSE_INSTRUCTOR']),updateMajor)
router.delete("/deleteMajor/:id",checkRole(['COURSE_INSTRUCTOR']),deleteMajor)

//Category
router.post("/createCategory",checkRole(['COURSE_INSTRUCTOR']),createCategory) ;
router.get("/getAllCategories",checkRole(['COURSE_INSTRUCTOR']),getAllCategories) ;
router.put("/updateCategory/:id",checkRole(['COURSE_INSTRUCTOR']),updateCategory);
router.delete("/deleteCategory/:id",checkRole(['COURSE_INSTRUCTOR']),deleteCategory)


// //Group
router.post("/createGroup",checkRole(['COURSE_INSTRUCTOR']),createGroup) ;
router.get("/getAllGroups",checkRole(['COURSE_INSTRUCTOR']),getAllGroups) ;
router.put("/updateGroup/:id",checkRole(['COURSE_INSTRUCTOR']),updateGroup);
router.delete("/deleteGroup/:id",checkRole(['COURSE_INSTRUCTOR']),deleteGroup)


// //Course
router.post("/createCourse",checkRole(['COURSE_INSTRUCTOR']),createCourse) ;
router.get("/getAllCourses",checkRole(['COURSE_INSTRUCTOR']),getAllCourses) ;
router.put("/updateCourse/:id",checkRole(['COURSE_INSTRUCTOR']),updateCourse);
router.delete("/deleteCourse/:id",checkRole(['COURSE_INSTRUCTOR']),deleteCourse)


module.exports = router;