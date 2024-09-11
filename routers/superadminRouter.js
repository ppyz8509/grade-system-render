const express = require('express');
const router = express.Router();
const { createSuperAdmin, getSuperAdmins, getSuperAdminById, updateSuperAdmin, deleteSuperAdmin } = require('../controllers/superAdminController');
const { authenticateToken}  = require("../middlewares/authorize");

// Apply authentication middleware to all admin routes
router.post("/createsuperAdmin", createSuperAdmin);
router.get("/getsuperAdmins", getSuperAdmins);
router.get("/getsuperAdminById/:admin_id", getSuperAdminById);
router.put("/updatesuperAdmin/:admin_id", updateSuperAdmin);
router.delete("/deletesuperAdmin/:admin_id", deleteSuperAdmin);

module.exports = router;
