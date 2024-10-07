const express = require("express");
const router = express.Router();
const { 
    createRegister,
    getRegisters,
    getRegisterById,
    getlistcourseRegisterById,
    updateRegister,
    deleteRegister,
} = require ("../controllers/register");

router.post("/createRegister",createRegister)
router.get("/getRegisters/:student_id",getRegisters);
router.get("/getRegisterById/:register_id",getRegisterById);
router.get("/getlistcourseRegisterById/:listcourseregister_id",getlistcourseRegisterById);
router.put("/updateRegister/:listcourseregister_id",updateRegister);
router.delete("/deleteRegister/:register_id",deleteRegister);

module.exports = router;