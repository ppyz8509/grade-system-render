const express = require("express");
const router = express.Router();
const { 
    createRegister,
    getRegisters,
    getRegisterById,
    updateRegister,
    deleteRegister,
    getCoursesByStudentId
} = require ("../controllers/register");

router.post("/createRegister",createRegister)
router.get("/getRegisters",getRegisters);
router.get("/getRegisterById/:register_id",getRegisterById);
router.get("/getCoursesByStudentId/:student_id",getCoursesByStudentId);
router.put("/updateRegister/:register_id",updateRegister);
router.delete("/deleteRegister/:register_id",deleteRegister);

module.exports = router;