const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { username, password, firstname, lastname, role, phone, email } = req.body;
    const teacher = await prisma.teacher.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        role,
        phone,
        email,
      },
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read Teachers
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Teacher
exports.getTeacherById = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { teacher_id: Number(teacher_id) },
    });
    if (teacher) {
      res.status(200).json(teacher);
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { username, password, firstname, lastname, role, phone, email } = req.body;
    const teacher = await prisma.teacher.update({
      where: { teacher_id: Number(teacher_id) },
      data: {
        username,
        password,
        firstname,
        lastname,
        role,
        phone,
        email,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await prisma.teacher.delete({
      where: { teacher_id: Number(teacher_id) },
    });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
