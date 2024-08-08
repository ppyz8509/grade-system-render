const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController'); // Assuming the controller file is named studentController.js

// Define routes and bind them to the controller functions
router.post('/createStudent', studentController.createStudent);
router.get('/getStudentById/:id', studentController.getStudentById);
router.put('/updateStudent/:id', studentController.updateStudent);
router.delete('/deleteStudent/:id', studentController.deleteStudent);
router.get('/getAllStudent', studentController.getAllStudent);

module.exports = router;