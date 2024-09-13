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

    // ตรวจสอบว่า register สำหรับ student_id, studentplan_id, year, semester มีอยู่แล้วหรือไม่
    const createdRegisters = await Promise.all(
      studentplans.map(async (plan) => {
        const existingRegister = await prisma.register.findFirst({
          where: {
            student_id: student_id,
            studentplan_id: plan.studentplan_id,
            year: plan.year,
            semester: plan.semester,
          },
        });

        if (existingRegister) {
          return existingRegister;
        }

        return prisma.register.create({
          data: {
            student_id: student_id,
            studentplan_id: plan.studentplan_id,
            year: plan.year,
            semester: plan.semester,
          },
        });
      })
    );

    // Loop ผ่าน studentplan ที่มีและสร้าง listcourseregister สำหรับแต่ละ course ใน Listcoursestudentplan
    const listcourseregisterEntries = await Promise.all(
      studentplans.flatMap(plan =>
        plan.Listcoursestudentplan.map(async (listCourse) => {
          // หา register ที่ตรงกับ studentplan_id
          const register = createdRegisters.find(r => r.studentplan_id === plan.studentplan_id);
          if (!register) return null;

          // ตรวจสอบว่ามี entry ใน listcourseregister อยู่แล้วหรือไม่
          const existingEntry = await prisma.listcourseregister.findFirst({
            where: {
              course_id: listCourse.course_id,
              register_id: register.register_id,
            },
          });

          if (existingEntry) {
            return null;  // ข้ามการสร้างถ้ามีอยู่แล้ว
          }

          // ถ้าไม่มีอยู่ใน listcourseregister ให้สร้างใหม่
          return prisma.listcourseregister.create({
            data: {
              course_id: listCourse.course_id,
              register_id: register.register_id,
            },
          });
        })
      )
    );
    
    
    const filteredListcourseregisterEntries = listcourseregisterEntries.filter(entry => entry !== null);

    res.status(201).json({ createdRegisters, listcourseregisterEntries: filteredListcourseregisterEntries });
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
          listcourseregister:{
            select:{
              listcourseregister_id:true,
              course:{
                select:{
                  courseNameTH:true}},
               grade:true,
                teacher:{
                select:{
                  titlename:true,
                  firstname:true,
                  lastname:true
                }
              }
            }
          }
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
      include:{
        listcourseregister:{
          
          select:{
            listcourseregister_id:true,
            grade:true,
            course:{
              select:{
                courseNameTH:true}},
            teacher:{
              select:{
                titlename:true,
                firstname:true,
                lastname:true
              }
            }
          }
        }
      }
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
    const { listcourseregister_id } = req.params;
    const { grade,teacher_id } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check for valid input
    if (isNaN(listcourseregister_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    if (!listcourseregister_id) {
      return res.status(400).json({ message: 'listcourseregister_id is required' });
    }

    // Get user from token
    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the section by sec_id
    const existslistcourseregister = await prisma.listcourseregister.findUnique({
      where: { listcourseregister_id: Number(listcourseregister_id) },
    });
    
    if (!existslistcourseregister) {
      return res.status(404).json({ message: 'Section not found' });
    }
    
    const existslistteacher = await prisma.teacher.findUnique({
      where: { teacher_id: Number(teacher_id) },
    });
    console.log("existslistteacher",existslistteacher);
    
    if (!existslistteacher) {
      return res.status(404).json({ message: 'teacher not found' });
    }
    

    // Proceed to update the section if academic_id matches
    const updatedlistcourseregister = await prisma.listcourseregister.update({
      where: { listcourseregister_id: Number(listcourseregister_id) },
      data: {
        grade,
        teacher_id,
      },include:{
        course:{
        select:{
          courseNameTH:true
        }
      },
        teacher:{
          select:{
            titlename:true,
            firstname:true,
            lastname:true,
          }
        }
      }
    });

    return res.status(200).json(updatedlistcourseregister);
  } catch (error) {
    return res.status(500).json({ error: error.message });
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
