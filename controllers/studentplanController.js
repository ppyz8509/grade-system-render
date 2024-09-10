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

exports.createStudentPlan = async (req, res) => {
  try {
    const { year, semester, course_id,academic_id } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!year || !semester || !course_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = getUserFromToken(token);
    console.log(user);

    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // ค้นหาข้อมูลที่มี year, semester, และ course_id ตรงกัน
    const existingCourse = await prisma.studentplan.findFirst({
      where: {
        year: year,
        semester: semester,
        course_id: course_id,
        academic_id: user.academic.academic_id,
      },
    });
    console.log("existingCourse", existingCourse);

    if (existingCourse) {
      return res.status(400).json({ message: 'Student plan already exists in a different academic' });
    }
    // // ถ้าพบข้อมูลที่ตรงกัน
    // if (existingCourse) {
    //   // ตรวจสอบว่า academic_id ของ existingCourse ตรงกับ academic_id ของผู้ใช้ที่ล็อกอินหรือไม่
    //   if (existingCourse.academic_id !== user.academic.academic_id) {
    //     return res.status(400).json({ message: 'Student plan already exists in a different academic' });
    //   }
    // }

    // ถ้าทุกเงื่อนไขผ่านให้สร้าง student plan ใหม่
    const student_plan = await prisma.studentplan.create({
      data: {
        year,
        semester,
        course_id,
        academic_id: user.academic.academic_id,
      },
    });
    res.status(201).json(student_plan);
  } catch (error) {
    console.error('Error creating student plan:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.getStudentPlans = async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');


    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const studentplans = await prisma.studentplan.findMany({
        where: {
          academic_id: user.academic.academic_id
        },
    });

    res.status(200).json(studentplans);
  } catch (error) {
    console.error('Error fetching student plans:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getStudentplanBySec = async (req, res) => {
  try {
    const { major_id } = req.params;

    if (!major_id) {
      return res.status(400).json({ message: 'Missing major_id' });
    }

    const studentplans = await prisma.studentplan.findMany({
      where: { major_id: Number(major_id) },
      include: {
        course: true, // Include course data
      },
    });

    if (!studentplans.length) {
      return res.status(404).json({ message: 'No student plans found for the given major_id' });
    }

    const groupedCourses = studentplans.reduce((acc, studentplan) => {
      const key = `Semester ${studentplan.semester}, Year ${studentplan.year}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        ...studentplan.course, // Spread operator properties of the course object
      });
      return acc;
    }, {});

    res.status(200).json(groupedCourses);
  } catch (error) {
    console.error('Error fetching student plans by major:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const { major_id, year, semester, course_id } = req.body;

    if (!major_id || !year || !semester || !course_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const student_plan = await prisma.studentplan.update({
      where: { studentplan_id: Number(studentplan_id) },
      data: {
        major_id,
        year,
        semester,
        course_id,
      },
    });
    res.status(200).json(student_plan);
  } catch (error) {
    console.error('Error updating student plan:', error);
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Student Plan not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;

    if (!studentplan_id) {
      return res.status(400).json({ message: 'Missing studentplan_id' });
    }

    const student_plan = await prisma.studentplan.delete({
      where: { studentplan_id: Number(studentplan_id) },
    });
    res.status(200).json(student_plan);
  } catch (error) {
    console.error('Error deleting student plan:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Student Plan not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
