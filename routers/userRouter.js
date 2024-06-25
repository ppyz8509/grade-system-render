// routers/userRouter.js

const express = require("express");
const { createUser, deleteUser, updateUser, createStudent, createAdmin, getAllAdmins } = require("../controllers/userController");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

router.post("/users", checkRole(['ADMIN']), createUser);
router.delete("/users/:userId", checkRole(['ADMIN']), deleteUser);
router.put("/users/:userId", checkRole(['ADMIN']), updateUser);
router.post("/students", checkRole(['ADVISOR']), createStudent);
router.post("/createAdmin", createAdmin);
router.get('/admins', getAllAdmins);
module.exports = router;
