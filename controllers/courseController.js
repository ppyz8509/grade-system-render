const prisma = require("../models/prisma");

// Create Course
exports.createCourse = async (req, res) => {
  const {
    nameThai,
    nameEnglish,
    creditUnits,
    responsibleInstructorId,
    category,
    creditUnitsCategory,
    groupCourseThai,
    groupCourseEnglish,
    semester,
    mandatorySubjects
  } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: {
        nameThai,
        nameEnglish,
        creditUnits,
        responsibleInstructorId,
        category,
        creditUnitsCategory,
        groupCourseThai,
        groupCourseEnglish,
        semester,
        mandatorySubjects
      },
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error("Error creating course:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update Course
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const {
    nameThai,
    nameEnglish,
    creditUnits,
    responsibleInstructorId,
    category,
    creditUnitsCategory,
    groupCourseThai,
    groupCourseEnglish,
    semester,
    mandatorySubjects
  } = req.body;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        nameThai,
        nameEnglish,
        creditUnits,
        responsibleInstructorId,
        category,
        creditUnitsCategory,
        groupCourseThai,
        groupCourseEnglish,
        semester,
        mandatorySubjects
      },
    });

    res.status(200).json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete Course
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get All Courses
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    res.status(400).json({ error: error.message });
  }
}