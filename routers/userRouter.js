const express = require("express");
const router = express.Router();
const {
  createUser,
  ///getAllUser,
  updateUser,
  deleteUser,
  getRole,
} = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");



///admin zone
router.post("/createUser",createUser);
//router.get("/getAllUser", getAllUser);
//router.get("/getRole/:role",getRole);
//router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id",  deleteUser);

module.exports = router;



