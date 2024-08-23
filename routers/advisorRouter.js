const express = require('express');
const router = express.Router();
const {

    createAdvisor,
    getAdvisors,
    getAdvisorById,
    updateAdvisor,
    deleteAdvisor,
}   = require('../controllers/advisorController'); // Assuming the controller file is named studentController.js

router.post('/createAdvisor', createAdvisor);
router.get('/getAdvisors', getAdvisors);
router.get('/getAdvisorById/:advisor_id', getAdvisorById);
router.put('/updateAdvisor/:advisor_id', updateAdvisor);
router.delete('/deleteAdvisor/:advisor_id', deleteAdvisor);

module.exports = router;