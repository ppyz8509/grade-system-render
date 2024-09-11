const express = require('express');
const router = express.Router();
const {
  createStudentPlan,
  getStudentPlans,
  updateStudentPlan,
  deleteStudentPlan,
  getStudentplanByAcademic,
  
} = require('../controllers/studentplanController');
const { authenticateToken, isAdmin, isAdvisor }  = require("../middlewares/authorize");

// Create a Student Plan
router.post('/createStudentPlan', createStudentPlan);

// Read all Student Plans
router.get('/getStudentPlans', getStudentPlans);
router.get('/getStudentplanByAcademic', getStudentplanByAcademic);


// Update a Student Plan
router.put('/updateStudentPlan/:studentplan_id',authenticateToken,isAdvisor, updateStudentPlan);

// Delete a Student Plan
router.delete('/deleteStudentPlan/:studentplan_id', deleteStudentPlan);

module.exports = router;
