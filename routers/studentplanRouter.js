const express = require('express');
const router = express.Router();
const {
  createStudentPlan,
  getStudentPlans,
  getStudentPlanById,
  updateStudentPlan,
  deleteStudentPlan,
  getStudentplan,
  
} = require('../controllers/studentplanController');

// Create a Student Plan
router.post('/createStudentPlan', createStudentPlan);

// Read all Student Plans
router.get('/getStudentPlans', getStudentPlans);
router.get('/getStudentplan/:sec_id', getStudentplan);

// Read a Single Student Plan
router.get('/getStudentPlanById/:studentplan_id', getStudentPlanById);

// Update a Student Plan
router.put('/updateStudentPlan/:studentplan_id', updateStudentPlan);

// Delete a Student Plan
router.delete('/deleteStudentPlan/:studentplan_id', deleteStudentPlan);

module.exports = router;
