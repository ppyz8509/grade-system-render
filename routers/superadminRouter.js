const express = require('express');
const router = express.Router();
const { createSuperAdmin, getSuperAdmins, getSuperAdminById, updateSuperAdmin, deleteSuperAdmin ,createAcademic ,getAcademicById,getAllAcademics,updateAcademic,deleteAcademic} = require('../controllers/superAdminController');
const { authenticateToken, isSuperAdmin}  = require("../middlewares/authorize");

// Apply authentication middleware to all admin routes
router.post("/createsuperAdmin", createSuperAdmin);
router.get("/getsuperAdmins", getSuperAdmins);
router.get("/getsuperAdminById/:admin_id", getSuperAdminById);
router.put("/updatesuperAdmin/:admin_id", updateSuperAdmin);
router.delete("/deletesuperAdmin/:admin_id", deleteSuperAdmin);

router.post("/createAcademic",authenticateToken ,isSuperAdmin ,createAcademic);
router.get("/getAllAcademics", getAllAcademics);
router.get("/getAcademicById/:academic_id", getAcademicById);
router.put("/updateAcademic/:academic_id", authenticateToken ,isSuperAdmin ,updateAcademic);
router.delete("/deleteAcademic/:academic_id",authenticateToken ,isSuperAdmin , deleteAcademic);

module.exports = router;
