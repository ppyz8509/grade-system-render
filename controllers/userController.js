// controllers/userController.js

const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");


//createAdmin
exports.createAdmin = async (req, res) => {
  const { name, username, password } = req.body;
  
  try {
    const existingAdmin = await prisma.admin.findFirst({
      where: { username },
    });

    if (existingAdmin && existingAdmin.role === 'ADMIN') {
      return res.status(400).send('Admin with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await prisma.admin.create({
      data: {
        name,
        username,
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


///getAllAdmins
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


///getalluser
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: {
          not: 'ADMIN'
        }
      }
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(400).json({ error: error.message });
  }
};



//createUser
exports.createUser = async (req, res) => {
  const { name, username, password, role } = req.body;
  try {
    if (!['ADVISOR', 'COURSE_INSTRUCTOR'].includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        username,
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


///deleteUser
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
///updateUser
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { name, username, role } = req.body;
  try {
    if (role && !['ADVISOR', 'COURSE_INSTRUCTOR', 'STUDENT'].includes(role)) {
      return res.status(400).send('Invalid role');
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId, 10) },
      data: { name, username, role },
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};


