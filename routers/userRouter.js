const express = require("express");
const router = express.Router();
const {
  createUser,
  getallUser,
  updateUser,
  deleteUser,
  getRole,
} = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");


///admin zone
router.post("/createUser", checkRole(['ADMIN']),createUser);
router.get("/getallUser", checkRole(['ADMIN']),getallUser);
router.get("/getRole/:role", checkRole(['ADMIN']),getRole);
router.put("/updateUser/:id",checkRole(['ADMIN']), updateUser);
router.delete("/deleteUser/:id", checkRole(['ADMIN']), deleteUser);

module.exports = router;



