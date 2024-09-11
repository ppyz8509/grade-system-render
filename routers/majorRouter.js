const express = require("express");
const router = express.Router();
const majorController = require("../controllers/majorController"); 
const { authenticateToken, isAdmin, isCourse_in }  = require("../middlewares/authorize");

//major
router.post("/createMajor",authenticateToken,isCourse_in, majorController.createMajor);
router.get("/getMajorByCode/:major_code", majorController.getMajorByCode);
router.get("/getAllMajors/",majorController.getAllMajors);
router.put("/updateMajor/:id", authenticateToken,isCourse_in,majorController.updateMajor);
router.delete("/deleteMajor/:major_id",authenticateToken,isCourse_in,majorController.deleteMajor);

//category
router.post("/createCategory", authenticateToken,isCourse_in,majorController.createCategory);
router.get("/getCategoryById/:id", majorController.getCategoryById);
router.get("/getAllCategories/", majorController.getAllCategories);
router.put("/updateCategory/:id",authenticateToken,isCourse_in, majorController.updateCategory);
router.delete("/deleteCategory/:id", authenticateToken,isCourse_in,majorController.deleteCategory);

//group_major
router.post("/createGroupMajor",authenticateToken,isCourse_in, majorController.createGroupMajor);
router.get("/getGroupMajorById/:id", majorController.getGroupMajorById);
router.get("/getAllGroupMajors", majorController.getAllGroupMajors);
router.put("/updateGroupMajor/:id", authenticateToken,isCourse_in,majorController.updateGroupMajor);
router.delete("/deleteGroupMajor/:id", authenticateToken,isCourse_in,majorController.deleteGroupMajor);

//course
router.post("/createCourse",authenticateToken,isCourse_in, majorController.createCourse);
router.get("/getAllCourses", majorController.getAllCourses);
router.get("/getCourseById/:id", majorController.getCourseById);
router.put("/updateCourse/:id", authenticateToken,isCourse_in,majorController.updateCourse);
router.delete("/deleteCourse/:id",authenticateToken,isCourse_in, majorController.deleteCourse);

router.get('/getCategoriesByMajorCode/:major_code', majorController.getCategoriesByMajorCode);
router.get('/getGroupsByCategoryId/:category_id', majorController.getGroupsByCategoryId);
router.get('/getCoursesByGroupId/:group_id', majorController.getCoursesByGroupId);
router.get('/getCoursesByCategoryId/:category_id', majorController.getCoursesByCategoryId);
module.exports = router;
