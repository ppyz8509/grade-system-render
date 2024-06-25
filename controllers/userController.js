// controllers/userController.js

const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");




exports.createAdmin = async (req, res) => {
  const { email, name, password } = req.body;
  try {
    const existingAdmin = await prisma.user.findFirst({
      where: { email: email },
    });

    if (existingAdmin && existingAdmin.role === 'ADMIN') {
      return res.status(400).send('Admin with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
    });
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  const { email, name, password, role } = req.body;
  try {
    if (!['ADVISOR', 'COURSE_INSTRUCTOR'].includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role,
      },
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    await prisma.user.delete({
      where: { id: parseInt(userId, 10) },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { email, name, role } = req.body;
  try {
    if (role && !['ADVISOR', 'COURSE_INSTRUCTOR', 'STUDENT'].includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { email, name, role },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.createStudent = async (req, res) => {
  const { email, name } = req.body;
  const advisorId = req.user.id; // Use the advisor's ID from the token
  try {
    const newStudent = await prisma.student.create({
      data: {
        email,
        name,
        advisorId,
      },
    });
    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating student:", error.message);
    res.status(400).json({ error: error.message });
  }
};

