// routers/courseRouter.js

const express = require("express");
const { createCourse } = require("../controllers/courseController");
const checkRole = require("../middlewares/checkRole");

const router = express.Router();

router.post("/courses", checkRole(['COURSE_INSTRUCTOR']), createCourse);

module.exports = router;
