const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { titlename, firstname, lastname } = req.body;
    const existTeacher = await prisma.teacher.findFirst({where: { firstname, lastname }})

    if (existTeacher) {
      return res.status(400).json({ message: "already Teacher"})
    }

    const teacher = await prisma.teacher.create({
      data: {
        titlename,
        firstname,
        lastname,
      },
    });
    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    if (teachers.length === 0) {
      return res.status(404).json({ message: 'Teacher have no' });
    }
    res.status(200).json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getTeacherById = async (req, res) => {
  try {
    const { teacher_id } = req.params;

    if (isNaN(teacher_id)) {
      return res.status(400).json({ message: "ID is not number"})
    }

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

exports.updateTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    if (isNaN(teacher_id)) {
      return res.status(400).json({ message: "ID is not number"})
    }
    const existTeacher = await prisma.teacher.findUnique({ 
      where: {teacher_id: Number(teacher_id)} })
    if (!existTeacher) {
      return res.status(400).json({ message:"teacher_id not found"})
    }
    const { titlename, firstname, lastname } = req.body;
    const teacher = await prisma.teacher.update({
      where: { teacher_id: Number(teacher_id) },
      data: {
        titlename,
        firstname,
        lastname,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    if (isNaN(teacher_id)) {
      return res.status(400).json({ message: "ID is not number"})
    }
    const existTeacher = await prisma.teacher.findUnique({ 
      where: {teacher_id: Number(teacher_id)} })
    if (!existTeacher) {
      return res.status(400).json({ message:"teacher_id not found"})
    }
    const teacher = await prisma.teacher.delete({
      where: { teacher_id: Number(teacher_id) },
    });
    res.status(200).json(teacher);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
