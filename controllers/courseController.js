// controllers/courseController.js

const prisma = require("../models/prisma");

exports.createCourse = async (req, res) => {
  const { name } = req.body;
  const instructorId = req.user.id;
  try {
    const newCourse = await prisma.course.create({
      data: {
        name,
        instructorId: parseInt(instructorId, 10),
      },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(400).json({ error: error.message });
  }
};
