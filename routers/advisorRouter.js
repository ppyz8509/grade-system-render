const express = require('express');
const router = express.Router();

const {

    createAdvisor,
    getAdvisors,
    getAdvisorById,
    updateAdvisor,
    deleteAdvisor,
}   = require('../controllers/advisorController'); // Assuming the controller file is named studentController.js
const { authenticateToken, isAdmin, isCourse_in }  = require("../middlewares/authorize");

router.post('/createAdvisor',authenticateToken,isCourse_in, createAdvisor);
router.get('/getAdvisors', getAdvisors);
router.get('/getAdvisorById/:advisor_id', getAdvisorById);
router.put('/updateAdvisor/:advisor_id',authenticateToken,isCourse_in, updateAdvisor);
router.delete('/deleteAdvisor/:advisor_id',authenticateToken,isCourse_in, deleteAdvisor);


module.exports = router;