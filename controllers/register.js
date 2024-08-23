const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Register
exports.createRegister = async (req, res) => {
  try {
    const { student_id } = req.params;
    const { grade, teacher_name } = req.body;

    // หา student เพื่อเอา sec_id
    const student = await prisma.student.findUnique({
      where: { student_id },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const { sec_id } = student;

    // หา studentplan ที่มี sec_id ตรงกัน
    const studentplans = await prisma.studentplan.findMany({
      where: { sec_id },
    });

    if (studentplans.length === 0) {
      return res.status(404).json({ message: 'No StudentPlans found for the given sec_id' });
    }

    // Loop ผ่าน studentplan และสร้าง register สำหรับแต่ละ plan
    const registers = await Promise.all(
      studentplans.map(async (plan) => {
        return prisma.register.create({
          data: {
            student_id,
            studentplan_id: plan.studentplan_id,
          },
        });
      })
    );

    res.status(201).json(registers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Registers
exports.getRegisters = async (req, res) => {
  try {
    const { student_id } = req.params;

    // Find registers for the given student_id
    const registers = await prisma.register.findMany({
      where: { student_id },
      include: {
        studentplan: {
          include: {
            course: true, // Include course information in the studentplan
          },
        },
      },
    });

    const groupedRegisters = registers.reduce((acc, register) => {
      const { semester, year } = register.studentplan;
      const semesterKey = `Semester ${semester}, Year ${year}`;

      if (!acc[semesterKey]) {
        acc[semesterKey] = [];
      }

      acc[semesterKey].push(register);
      return acc;
    }, {});

    res.status(200).json(groupedRegisters);
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

// Update a Register
exports.updateRegister = async (req, res) => {
  try {
    const { register_id } = req.params;
    const { student_id, grade, teacher_name, studentplan_id } = req.body;
    const register = await prisma.register.update({
      where: { register_id: Number(register_id) },
      data: {
        student_id,
        grade,
        teacher_name,
        studentplan_id,
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
