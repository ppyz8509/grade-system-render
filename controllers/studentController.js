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

// Create a Student
exports.createStudent = async (req, res) => {
  try {
    const {major_id,student_id, username, password, firstname, lastname, phone, email, sec_id,titlenameTh } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!student_id || !username || !password || !firstname || !lastname || !sec_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }

    const existingstudent = await prisma.student.findUnique({ where: { student_id , username } });
    if (existingstudent) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = getUserFromToken(token);
    console.log(user);

    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }


    const student = await prisma.student.create({
      data: {
        student_id,
        username,
        password,
        titlenameTh,
        firstname,
        lastname,
        phone,
        email,
        sec_id,
        major_id,
        advisor_id: user.id,
        academic_id: user.academic.academic_id,
      },
    });
    return res.status(201).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Read all Students
exports.getStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany(
      {   include: {
        advisor: {
          select: {
            titlename: true,
            firstname: true,
            lastname: true,
          }
        }
      }
}
    );
    if (students.length === 0) {
      return res.status(404).json({ message: 'students have no' });
    }
    return res.status(200).json(students);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getStudentforCheck = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (isNaN(student_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    const student = await prisma.student.findUnique({
      where: { student_id: String(student_id) },
      include: {
        major: true,
        advisor: {
          select: {
            titlename: true,
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    } 
    
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


// Read a Single Student
exports.getStudentById = async (req, res) => {
  try {
    const { student_id } = req.params;

    if (isNaN(student_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    const student = await prisma.student.findUnique({
      where: { student_id: String(student_id)
      }, include:{
          
        advisor: {
          select: {
            titlename: true,
            firstname: true,
            lastname: true,
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: 'student not found' });
    } 
    return res.status(200).json(student);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Update a Student
exports.updateStudent = async (req, res) => {
  try {
    const { student_id } = req.params;
    const {        
      username,
      password,
      firstname,
      lastname,
      titlenameTh,
      phone,
      email,
      birthdate,
      monthdate,
      yeardate,
      titlenameEng,
      firstnameEng,
      lastnameEng,
      sector_status,
      sec_id,
      corps,
      pre_educational,
      graduated_from,
      pregraduatedyear,
      afterendcontact,
      homenumber,
      road,
      alley,
      subdistrict,
      district,
      province,
      zipcode,
      advisor,
      wanttoend,
      yeartoend,
    } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');


    if (isNaN(student_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }

    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      console.log(user);

      return res.status(403).json({ message: 'Unauthorized' });
    }

    const studentExists = await prisma.student.findUnique({
      where: { student_id: String(student_id) },
    });

    if (!studentExists) {
      console.log(studentExists);
      
      return res.status(404).json({ message: 'student not found' });
    }

    if (studentExists.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }

    const student = await prisma.student.update({
      where: { student_id: String(student_id) },
      data: {
      username,
      password,
      firstname,
      lastname,
      titlenameTh,
      phone,
      email,
      birthdate,
      monthdate,
      yeardate,
      titlenameEng,
      firstnameEng,
      lastnameEng,
      sector_status,
      sec_id,
      corps,
      pre_educational,
      graduated_from,
      pregraduatedyear,
      afterendcontact,
      homenumber,
      road,
      alley,
      subdistrict,
      district,
      province,
      zipcode,
      advisor,
      wanttoend,
      yeartoend,
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
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // ตรวจสอบว่า student_id เป็นตัวเลขหรือไม่
    if (isNaN(student_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    // ดึงข้อมูล user จาก token
    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // ตรวจสอบว่านักเรียนที่ต้องการลบมีอยู่หรือไม่
    const studentExists = await prisma.student.findUnique({
      where: { student_id: String(student_id) },
    });

    if (!studentExists) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // ตรวจสอบสิทธิ์ในการลบ (Academic ID ต้องตรงกัน)
    if (studentExists.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }

    // ลบข้อมูลที่เกี่ยวข้องกับ student ใน listcourseregister -> register -> student

    // 1. ลบข้อมูลใน listcourseregister ที่อ้างอิงถึง register ของ student นี้
    await prisma.listcourseregister.deleteMany({
      where: {
        register: {
          student_id: String(student_id)
        }
      }
    });

    // 2. ลบข้อมูลใน register ที่อ้างอิงถึง student นี้
    await prisma.register.deleteMany({
      where: { student_id: String(student_id) },
    });

    // 3. ลบนักเรียน
    const student = await prisma.student.delete({
      where: { student_id: String(student_id) },
    });

    // ส่ง response กลับเมื่อการลบสำเร็จ
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateStudentInfo = async (req, res) => {
  try {
    const { student_id } = req.params; // รับ student_id จากพารามิเตอร์ URL
    const {
      firstnameEng,
      lastnameEng,
      personal_id,
      corps,
      center,
      major,
      minor_subject,
      status,
      entered_join,
      pre_educational,
      submission_status,
      graduated_from,
      advisor,
      address
    } = req.body; // ข้อมูลที่ต้องการอัปเดตจาก request body

    // อัปเดตข้อมูลนักเรียน
    const updatedStudent = await prisma.student.update({
      where: {
        student_id: student_id
      },
      data: {
        firstnameEng,
        lastnameEng,
        personal_id,
        corps,
        center,
        major,
        minor_subject,
        status,
        entered_join,
        pre_educational,
        submission_status,
        graduated_from,
        advisor,
        address
      }
    });

    // ส่งข้อมูลนักเรียนที่อัปเดตแล้วกลับไป
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
