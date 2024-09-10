const express = require('express');
const router = express.Router();
const {
  createStudentPlan,
  getStudentPlans,
  updateStudentPlan,
  deleteStudentPlan,
  getStudentplanBySec,
  
} = require('../controllers/studentplanController');

// Create a Student Plan
router.post('/createStudentPlan', createStudentPlan);

// Read all Student Plans
router.get('/getStudentPlans', getStudentPlans);
router.get('/getStudentplanBySec/:sec_id', getStudentplanBySec);


// Update a Student Plan
router.put('/updateStudentPlan/:studentplan_id', updateStudentPlan);

// Delete a Student Plan
router.delete('/deleteStudentPlan/:studentplan_id', deleteStudentPlan);

module.exports = router;
