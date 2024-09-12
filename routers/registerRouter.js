const express = require("express");
const router = express.Router();
const { 
    createRegister,
    getRegisters,
    getRegisterById,
    updateRegister,
    deleteRegister,
} = require ("../controllers/register");

router.post("/createRegister",createRegister)
router.get("/getRegisters/:student_id",getRegisters);
router.get("/getRegisterById/:register_id",getRegisterById);
router.put("/updateRegister/",updateRegister);
router.delete("/deleteRegister/:register_id",deleteRegister);

module.exports = router;