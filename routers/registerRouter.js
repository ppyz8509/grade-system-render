const express = require("express");
const router = express.Router();
const { 
    createRegister,
    getRegisters,
    getRegisterById,
    updateRegister,
    deleteRegister,
} = require ("../controllers/register");

router.post("/createRegister/:student_id",createRegister)
router.get("/getRegisters/:student_id",getRegisters);
router.get("/getRegisterById/:register_id",getRegisterById);
router.put("/updateRegister/:register_id",updateRegister);
router.delete("/deleteRegister/:register_id",deleteRegister);

module.exports = router;