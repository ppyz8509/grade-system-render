const express = require('express');
const router = express.Router();
const {

    createSection,
    getSections,
    getSectionById,
    updateSection,
    deleteSection,
}   = require('../controllers/sectionController'); // Assuming the controller file is named studentController.js
const { authenticateToken, isAdmin, isCourse_in }  = require("../middlewares/authorize");

router.post('/createSection',authenticateToken, isCourse_in, createSection);
router.get('/getSections', getSections);
router.get('/getSectionById/:sec_id', getSectionById);
router.put('/updateSection/:sec_id',authenticateToken, isCourse_in, updateSection);
router.delete('/deleteSection/:sec_id',authenticateToken, isCourse_in, deleteSection);

module.exports = router;