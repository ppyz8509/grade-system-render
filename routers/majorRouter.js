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
  createSubgroup,
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
router.post("/createMajor",createMajor);
router.get("/getMajorById/:id",getMajorById);


//Category
router.post("/createCategory",createCategory) ;



// //Group
router.post("/createGroup",createGroup) ;
router.post("/createSubgroup/subgroup", createSubgroup);
router.delete("/deleteGroup/:id",deleteGroup) ;



// //Course
router.post("/createCourse",createCourse) ;
router.delete("/deleteCategory/:id",deleteCategory) ;



module.exports = router;