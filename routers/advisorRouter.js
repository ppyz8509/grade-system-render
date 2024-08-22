const express = require('express');
const router = express.Router();
const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent,

    createAdvisor,
    getAdvisors,
    getAdvisorById,
    updateAdvisor,
    deleteAdvisor,
}   = require('../controllers/studentController'); // Assuming the controller file is named studentController.js

// Define routes and bind them to the controller functions
router.post('/createStudent', createStudent);
router.get('/getStudents', getStudents);
router.get('/getStudentById/:student_id', getStudentById);
router.put('/updateStudent/:student_id', updateStudent);
router.delete('/deleteStudent/:student_id', deleteStudent);

router.post('/createAdvisor', createAdvisor);
router.get('/getAdvisors', getAdvisors);
router.get('/getAdvisorById/:advisor_id', getAdvisorById);
router.put('/updateAdvisor/:advisor_id', updateAdvisor);
router.delete('/deleteAdvisor/:advisor_id', deleteAdvisor);



module.exports = router;