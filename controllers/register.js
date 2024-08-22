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
      return res.status(404).json({ message: 'StudentPlan not found for the given sec_id' });
    }

    // จัดกลุ่ม studentplan ตาม sec_id
    const groupedStudentPlans = studentplans.reduce((acc, plan) => {
      if (!acc[plan.sec_id]) {
        acc[plan.sec_id] = [];
      }
      acc[plan.sec_id].push(plan);
      return acc;
    }, {});

    // ใช้ studentplan_id ของ studentplan แรก (ถ้ามีหลายรายการอาจต้องปรับ)
    const studentplan_id = studentplans[0].studentplan_id;

    // สร้าง register
    const register = await prisma.register.create({
      data: {
        student_id,
        grade,
        teacher_name,
        studentplan_id,
      },
    });

    // ดึงข้อมูล register พร้อม studentplan ที่เกี่ยวข้อง
    const registerWithStudentplan = await prisma.register.findUnique({
      where: { register_id: register.register_id },
      studentplan: {
        include: {
          course: true, // รวมข้อมูลของ course ใน studentplan
        },
      },
    });

    res.status(201).json({ register: registerWithStudentplan, groupedStudentPlans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Read all Registers
exports.getRegisters = async (req, res) => {
  try {
    const { student_id } = req.params;

    // หา register ที่เกี่ยวข้องกับ student_id
    const registers = await prisma.register.findMany({
      where: { student_id },
      include: {
        studentplan: true, // รวมข้อมูลของ studentplan ที่เกี่ยวข้อง
      },
    });

    if (registers.length === 0) {
      return res.status(404).json({ message: 'Registers not found for the given student_id' });
    }

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
