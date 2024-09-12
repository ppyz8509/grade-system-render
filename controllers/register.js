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
      include: { Listcoursestudentplan: true },
    });

    console.log("studentplan",studentplans);
    
    if (!studentplans.length) {
      return res.status(404).json({ message: 'No student plans found for this academic ID' });
    }

    const createdRegisters = await Promise.all(studentplans.map(async (studentplans) => {
        return prisma.register.create({
          data: {
            student_id: student_id,
            studentplan_id: studentplans.studentplan_id,
            year: studentplans.year,
            semester: studentplans.semester,
          },
        });
      })
    );

    // Loop ผ่าน studentplan ที่ใหม่และสร้าง listcourseregister สำหรับแต่ละ course ใน Listcoursestudentplan
    const listcourseregisterEntries = await Promise.all(
      studentplans.flatMap(plan =>
        plan.Listcoursestudentplan.map(async (Listcoursestudentplan) => {
          return prisma.listcourseregister.create({
            data: {
              course_id: Listcoursestudentplan.course_id,
              register_id: createdRegisters.find(register => register.studentplan_id === plan.studentplan_id).register_id,
              // คุณสามารถเพิ่มฟิลด์อื่นๆ ที่จำเป็นที่นี่
            },
          });
        })
      )
    );

    
    
    res.status(201).json(listcourseregisterEntries);
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
        include:{
          listcourseregister: true
        }
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
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const { updates } = req.body; // ใช้ `updates` ซึ่งเป็น array ของข้อมูลที่ต้องการอัปเดต

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({ message: 'Invalid updates array' });
    }

    const user = getUserFromToken(token);
    if (!user || !user.academic || !user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const academic_id = user.academic.academic_id;
    const student_id = user.id;

    // ตรวจสอบข้อมูลที่ต้องอัปเดต
    const updatePromises = updates.map(async (update) => {
      const { Listcoursestudentplan_id, grade, teacher_name } = update;

      // ตรวจสอบการมีอยู่ของ Listcoursestudentplan
      const listcoursestudentplan = await prisma.listcoursestudentplan.findUnique({
        where: { Listcoursestudentplan_id: Number(Listcoursestudentplan_id) },
      });

      if (!listcoursestudentplan) {
        return { Listcoursestudentplan_id, error: 'Listcoursestudentplan not found' };
      }

      // ตรวจสอบ academic_id
      if (listcoursestudentplan.academic_id !== academic_id) {
        return { Listcoursestudentplan_id, error: 'Academic ID mismatch' };
      }

      // อัปเดตข้อมูล
      const updated = await prisma.listcoursestudentplan.update({
        where: { Listcoursestudentplan_id: Number(Listcoursestudentplan_id) },
        data: {
          grade: grade || listcoursestudentplan.grade,
          teacher_name: teacher_name || listcoursestudentplan.teacher_name,
        },
      });

      return updated;
    });

    const results = await Promise.all(updatePromises);

    // แสดงผลลัพธ์ที่ได้รับ
    res.status(200).json(results);
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
