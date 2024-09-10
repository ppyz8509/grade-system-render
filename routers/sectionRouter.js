const express = require('express');
const router = express.Router();
const {

    createSection,
    getSections,
    getSectionById,
    updateSection,
    deleteSection,
}   = require('../controllers/sectionController'); // Assuming the controller file is named studentController.js

router.post('/createSection', createSection);
router.get('/getSections', getSections);
router.get('/getSectionById/:sec_id', getSectionById);
router.put('/updateSection/:sec_id', updateSection);
router.delete('/deleteSection/:sec_id', deleteSection);

module.exports = router;