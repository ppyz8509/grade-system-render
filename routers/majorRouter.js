const express = require("express");
const router = express.Router();
const majorController = require("../controllers/majorController"); 
//const checkRole = require('../middlewares/checkRole');

//major
router.post("/createMajor", majorController.createMajor);
router.get("/getMajorByCode/:major_code", majorController.getMajorByCode);
router.get("/getAllMajors/", majorController.getAllMajors);
router.put("/updateMajor/:id", majorController.updateMajor);
router.delete("/deleteMajor/:major_code", majorController.deleteMajor);

//category
router.post("/createCategory", majorController.createCategory);
router.get("/getCategoryById/:id", majorController.getCategoryById);
router.get("/getAllCategories/", majorController.getAllCategories);
router.put("/updateCategory/:id", majorController.updateCategory);
router.delete("/deleteCategory/:id", majorController.deleteCategory);

//group_major
router.post("/createGroupMajor", majorController.createGroupMajor);
router.get("/getGroupMajorById/:id", majorController.getGroupMajorById);
router.get("/getAllGroupMajors", majorController.getAllGroupMajors);
router.put("/updateGroupMajor/:id", majorController.updateGroupMajor);
router.delete("/deleteGroupMajor/:id", majorController.deleteGroupMajor);

//course
router.post("/createCourse", majorController.createCourse);
router.get("/getAllCourses", majorController.getAllCourses);
router.get("/getCourseById/:id", majorController.getCourseById);
router.put("/updateCourse/:id", majorController.updateCourse);
router.delete("/deleteCourse/:id", majorController.deleteCourse);

router.get('/MajorId/:major_id', majorController.getCategoryAndGroupMajorByMajorId);
router.get('/getCoursesByCategoryId/:category_id', majorController.getCoursesByCategoryId);
module.exports = router;
