const express = require('express');
const router = express.Router();
const {
  createStudentPlan,
  createListStudentplan,
  getStudentPlans,
  updateStudentPlan,
  deleteStudentPlan,
  getStudentplanByAcademic,
  deleteListStudentplan
  
} = require('../controllers/studentplanController');
const { authenticateToken, isAdmin, isAdvisor }  = require("../middlewares/authorize");

// Create a Student Plan
router.post('/createStudentPlan', createStudentPlan);
router.post('/createListStudentplan/:studentplan_id', createListStudentplan);

// Read all Student Plans
router.get('/getStudentPlans', getStudentPlans);
router.get('/getStudentplanByAcademic', getStudentplanByAcademic);


// Update a Student Plan
router.put('/updateStudentPlan/:studentplan_id',authenticateToken,isAdvisor, updateStudentPlan);

// Delete a Student Plan
router.delete('/deleteStudentPlan/:studentplan_id', deleteStudentPlan);
router.delete('/deleteListStudentplan/:Listcoursestudentplan_id', deleteListStudentplan);

module.exports = router;
