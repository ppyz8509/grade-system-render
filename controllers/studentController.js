const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Student
exports.createStudent = async (req, res) => {
  try {
    const { student_id, username, password, firstname, lastname, phone, email, sec_id } = req.body;
    const student = await prisma.student.create({
      data: {
        student_id,
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
        sec_id,
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Student
exports.getStudentById = async (req, res) => {
  try {
    const { student_id } = req.params;
    const student = await prisma.student.findUnique({
      where: { student_id: Number(student_id) },
    });
    if (student) {
      res.status(200).json(student);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Student
exports.updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;
    const student = await prisma.student.update({
      where: { student_id: Number(student_id) },
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
        sec_id,
      },
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Student
exports.deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const student = await prisma.student.delete({
      where: { student_id: Number(student_id) },
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
