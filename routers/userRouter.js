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
router.post("/createUser", createUser);
router.get("/getallUser", getallUser);
router.get("/getRole/:role", getRole);
router.put("/updateUser/:id", updateUser);
router.delete("/deleteUser/:id", checkRole(['ADMIN']), deleteUser);
module.exports = router;



