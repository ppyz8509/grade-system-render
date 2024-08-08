const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Register
exports.createRegister = async (req, res) => {
  try {
    const { semester, year, grade, teacher_id, course_id, student_id } = req.body;
    const register = await prisma.register.create({
      data: {
        semester,
        year,
        grade,
        teacher_id,
        course_id,
        student_id,
      },
    });
    res.status(201).json(register);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Registers
exports.getRegisters = async (req, res) => {
  try {
    const registers = await prisma.register.findMany();
    res.status(200).json(registers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Register
exports.getRegisterById = async (req, res) => {
  try {
    const { register_id } = req.params;
    const register = await prisma.register.findUnique({
      where: { register_id: Number(register_id) },
    });
    if (register) {
      res.status(200).json(register);
    } else {
      res.status(404).json({ message: 'Register not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCoursesByStudentId = async (req, res) => {
    try {
      const { student_id } = req.params;
  
      const registrations = await prisma.register.findMany({
        where: { student_id: Number(student_id) },
        include: {
          course: true, // Include course data
          teacher: {
            select: {
              firstname: true,
              lastname: true, // Include only teacher's firstname
            }
          },
        },
      });
  
      const groupedCourses = registrations.reduce((acc, registration) => {
        const key = `Semester ${registration.semester}, Year ${registration.year}`;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push({
          ...registration.course, //  spread operator properties of the course object
          teacherfirstname: registration.teacher.firstname,
          teacherlastname: registration.teacher.lastname,
          register: {
            semester: registration.semester,
            year: registration.year,
            grade: registration.grade,
          },
        });
        return acc;
      }, {});
  
      res.status(200).json(groupedCourses);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

// Update a Register
exports.updateRegister = async (req, res) => {
  try {
    const { register_id } = req.params;
    const { semester, year, grade, teacher_id, course_id, student_id } = req.body;
    const register = await prisma.register.update({
      where: { register_id: Number(register_id) },
      data: {
        semester,
        year,
        grade,
        teacher_id,
        course_id,
        student_id,
      },
    });
    res.status(200).json(register);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Register
exports.deleteRegister = async (req, res) => {
  try {
    const { register_id } = req.params;
    const register = await prisma.register.delete({
      where: { register_id: Number(register_id) },
    });
    res.status(200).json(register);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

