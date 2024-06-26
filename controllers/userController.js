// controllers/userController.js

const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");

// createAdmin
exports.createAdmin = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if admin with the same username already exists
    const existingAdmin = await prisma.admin.findFirst({
      where: { username },
    });

    if (existingAdmin) {
      return res.status(400).send('Admin with this username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: 'ADMIN', // Assuming 'ADMIN' role is hardcoded for admin creation
      },
    });

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    res.status(400).json({ error: error.message });
  }
};


///getAllAdmins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      where: { role: 'ADMIN' },
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(400).json({ error: error.message });
  }
};


///---------------------------------------------------------------------------------------------------------------------------///

// Create Advisor
exports.createAdvisor = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if advisor with the same username already exists
    const existingAdvisor = await prisma.advisor.findFirst({
      where: { username },
    });

    if (existingAdvisor) {
      return res.status(400).send('Advisor with this username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new advisor
    const newAdvisor = await prisma.advisor.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: 'ADVISOR',
      },
    });

    res.status(201).json(newAdvisor);
  } catch (error) {
    console.error("Error creating advisor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update Advisor
exports.updateAdvisor = async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedAdvisor = await prisma.advisor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json(updatedAdvisor);
  } catch (error) {
    console.error("Error updating advisor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete Advisor
exports.deleteAdvisor = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.advisor.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting advisor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get All Advisors
exports.getAllAdvisors = async (req, res) => {
  try {
    const advisors = await prisma.advisor.findMany({
      where: { role: 'ADVISOR' },
    });
    res.status(200).json(advisors);
  } catch (error) {
    console.error("Error fetching advisors:", error.message);
    res.status(400).json({ error: error.message });
  }
};


///---------------------------------------------------------------------------------------------------------------------------///


// Create Course Instructor
exports.createCourseInstructor = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if course instructor with the same username already exists
    const existingCourseInstructor = await prisma.courseInstructor.findFirst({
      where: { username },
    });

    if (existingCourseInstructor) {
      return res.status(400).send('Course instructor with this username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new course instructor
    const newCourseInstructor = await prisma.courseInstructor.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: 'COURSE_INSTRUCTOR',
      },
    });

    res.status(201).json(newCourseInstructor);
  } catch (error) {
    console.error("Error creating course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update CourseInstructor
exports.updateCourseInstructor = async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedInstructor = await prisma.courseInstructor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json(updatedInstructor);
  } catch (error) {
    console.error("Error updating course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete CourseInstructor
exports.deleteCourseInstructor = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.courseInstructor.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get All CourseInstructors
exports.getAllCourseInstructors = async (req, res) => {
  try {
    const instructors = await prisma.courseInstructor.findMany({
      where: { role: 'COURSE_INSTRUCTOR' },
    });
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error fetching course instructors:", error.message);
    res.status(400).json({ error: error.message });
  }
};


///---------------------------------------------------------------------------------------------------------------------------///