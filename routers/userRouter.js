// routers/userRouter.js

const express = require("express");
const { createUser, deleteUser, updateUser, getAllUsers, createAdmin, getAllAdmins } = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");
//const authenticate = require("../middlewares/authenticate");

const router = express.Router();

//router.use(authenticate); // Ensure all routes are authenticated

router.post("/users", checkRole(['ADMIN']), createUser);
router.delete("/users/:userId", checkRole(['ADMIN']), deleteUser);
router.put("/users/:userId", checkRole(['ADMIN']), updateUser);
router.post("/createAdmin", createAdmin);
router.get('/getAllAdmins', getAllAdmins);
router.get('/getAllUsers', getAllUsers);
module.exports = router;
