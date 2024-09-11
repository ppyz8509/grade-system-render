const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

// Helper function to extract user information from JWT token
const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
  
};

exports.createRegister = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    const user = getUserFromToken(token);
    if (!user || !user.academic || !user.id) {
      console.log("user",user);
      
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const academic_id = user.academic.academic_id;
    const student_id = user.id;
    
    console.log("academic_id", academic_id);
    console.log("student_id", student_id);
    
    // หา studentplan ที่มี academic_id ตรงกับที่ได้จาก token
    const studentplans = await prisma.studentplan.findMany({
      where: { academic_id: academic_id },
    });
    
    if (!studentplans.length) {
      return res.status(404).json({ message: 'No student plans found for this academic ID' });
    }
    
    // หา register ที่มีอยู่แล้วโดยใช้ student_id และ studentplan_id
    const existingRegisters = await prisma.register.findMany({
      where: {
        student_id: student_id,
        studentplan_id: {
          in: studentplans.map(plan => plan.studentplan_id),
        },
      },
    });
    
    // สร้างชุดของ studentplan_id ที่มีอยู่แล้ว
    const existingStudentplanIds = new Set(existingRegisters.map(reg => reg.studentplan_id));
    
    // กรอง studentplan ที่ยังไม่ถูกสร้าง
    const newStudentplans = studentplans.filter(plan => !existingStudentplanIds.has(plan.studentplan_id));
    
    if (newStudentplans.length === 0) {
      return res.status(200).json({ message: 'All studentplans have already been registered' });
    }
    
    // Loop ผ่าน studentplan ที่ใหม่และสร้าง register สำหรับแต่ละ plan
    const registers = await Promise.all(
      newStudentplans.map(async (plan) => {
        return prisma.register.create({
          data: {
            student_id: student_id,
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
    const student = await prisma.student.findUnique({
      where: { student_id },
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Find registers for the given student_id
    const registers = await prisma.register.findMany({
      where: { student_id },
      include: {
        studentplan: {
          include: {
            Listcoursestudentplan: {
              select: {course_id:true}
            }
          },
        },
      },
    });

    return res.status(200).json(registers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
    const { grade, teacher_name, student_id } = req.body;

    // อัปเดตข้อมูล register
    const updatedRegister = await prisma.register.update({
      where: { register_id: Number(register_id) },
      data: {
        grade, // อัปเดต grade
        teacher_name, // อัปเดต teacher_name
      },
    });

    // ดึงข้อมูล studentplan ที่เกี่ยวข้องกับ register ที่อัปเดต
    const studentplan = await prisma.studentplan.findUnique({
      where: { studentplan_id: updatedRegister.studentplan_id },
      include: { course: true }, // ดึงข้อมูล course ที่เกี่ยวข้อง
    });

    // ตรวจสอบว่าพบ studentplan หรือไม่
    if (!studentplan) {
      return res.status(404).json({ message: 'Studentplan not found' });
    }



    // รวมข้อมูล course ที่เกี่ยวข้อง
    const courseInfo = {      
      course_id: studentplan.course.course_id,
      course_name: studentplan.course.courseNameTH || studentplan.course.courseNameENG,
      student_id: updatedRegister.student_id,
      grade: updatedRegister.grade,
      teacher_name: updatedRegister.teacher_name,

    };

    // ส่งผลลัพธ์ที่อัปเดตและข้อมูล course
    res.status(200).json(courseInfo);
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
