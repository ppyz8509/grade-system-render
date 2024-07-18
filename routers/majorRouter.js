const express = require("express");
const router = express.Router();
const {
  createMajor,
  getallMajor,
  getIdMajor,
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
router.post("/createMajor", createMajor);
router.get("/getallMajor",getallMajor)
router.put("/updateMajor/:id",updateMajor)
router.delete("/deleteMajor/:id",deleteMajor)

//Category
router.post("/createCategory",createCategory) ;
router.get("/getAllCategories",getAllCategories) ;
router.put("/updateCategory/:id",updateCategory);
router.delete("/deleteCategory/:id",deleteCategory)


// //Group
router.post("/createGroup",createGroup) ;
router.get("/getAllGroups",getAllGroups) ;
router.put("/updateGroup/:id",updateGroup);
router.delete("/deleteGroup/:id",deleteGroup)


// //Course
router.post("/createCourse",createCourse) ;
router.get("/getAllCourses",getAllCourses) ;
router.put("/updateCourse/:id",updateCourse);
router.delete("/deleteCourse/:id",deleteCourse)


module.exports = router;