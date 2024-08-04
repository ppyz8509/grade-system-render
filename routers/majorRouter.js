const express = require("express");
const router = express.Router();
const {
  createMajor,
  getAllMajors,
  getMajorById,
  getCategoriesByMajorId, 
  getGroupsByCategoryId,
  getCoursesByGroupId,
  updateMajor,
  deleteMajor,
  createCategory,
  getAllCategories,
  getCategoryById ,
  updateCategory,
  deleteCategory,
  createGroup,
  getAllGroups,
  updateGroup,
  deleteGroup,
  createCourse,
  updateCourse ,
  getAllCourses,
  getCourseById ,
  deleteCourse ,
} = require("../controllers/majorController");
const checkRole = require("../middlewares/checkRole");


///major
router.post("/createMajor",createMajor);
router.get("/getMajorById/:id",getMajorById);
router.get("/categories/major/:majorId", getCategoriesByMajorId); 
router.get("/getAllMajors",getAllMajors);
router.put("/updateMajor/:id",updateMajor);
router.delete("/deleteMajor/:id",deleteMajor);


//Category
router.post("/createCategory",createCategory) ;
router.get("/getCategoryById/:id",getCategoryById );
router.get("/getAllCategories",getAllCategories);
router.put("/updateCategory/:id",updateCategory) ;
router.delete("/deleteCategory/:id",deleteCategory) ;


// //Group
router.post("/createGroup",createGroup) ;
router.get("/getAllGroups",getAllGroups);
router.get("/group/category/:categoryId",getGroupsByCategoryId)
router.put("/updateGroup/:id",updateGroup ) ;
router.delete("/deleteGroup/:id",deleteGroup) ;


// //Course
router.post("/createCourse",createCourse) ;
router.get("/getCourseById/:id",getCourseById );
router.get("/getAllCourses",getAllCourses);
router.put("/updateCourse/:id",updateCourse) ;
router.delete("/deleteCourse/:id",deleteCourse) ;
router.get('/courses/group/:groupId', getCoursesByGroupId);




module.exports = router;