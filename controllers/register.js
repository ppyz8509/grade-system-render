const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    const { sec_id } = student; //destructuring assignment samesame const sec_id = student.sec_id;

    // หา studentplan ที่มี sec_id ตรงกัน
    const studentplans = await prisma.studentplan.findMany({
      where: { sec_id },
    });

    if (studentplans.length === 0) {
      return res.status(404).json({ message: 'No StudentPlans found for the given sec_id' });
    }

    // หา register ที่มีอยู่แล้วโดยใช้ student_id และ studentplan_id
    const existingRegisters = await prisma.register.findMany({
      where: {
        student_id,
        studentplan_id: {
          in: studentplans.map(plan => plan.studentplan_id), //ใช้เพื่อค้นหาหรือกรองข้อมูลที่ตรงกับค่าหนึ่งในชุดของค่าที่กำหนด   in: [1, 2, 3],
        },
      },
    });

    // สร้างชุดของ studentplan_id ที่มีอยู่แล้ว
    const existingStudentplanIds = new Set(existingRegisters.map(registed => registed.studentplan_id));

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
            student_id,
            studentplan_id: plan.studentplan_id,
            grade: grade || null, // สามารถใส่ค่า default หรือ null
            teacher_name: teacher_name || null, // สามารถใส่ค่า default หรือ null
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
            course: true, // Include course information in the studentplan
          },
        },
      },
    });

    // Group registers by semester and year
    const groupedRegisters = registers.reduce((acc, register) => {
      const { semester, year, course } = register.studentplan;
      const semesterKey = `Semester ${semester}, Year ${year}`;

      if (!acc[semesterKey]) {
        acc[semesterKey] = [];
      }

      acc[semesterKey].push({        
        register_id: register.register_id,
        course_id: course.course_id,
        courseNameTH: course.courseNameTH,
        courseNameENG: course.courseNameENG,
        grade: register.grade,
        teacher_name: register.teacher_name,

      });

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
