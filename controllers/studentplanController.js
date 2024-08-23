const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Student Plan
exports.createStudentPlan = async (req, res) => {
  try {
    const { sec_id, year, semester, course_id } = req.body;
    const student_plan = await prisma.studentplan.create({
      data: {
        sec_id,
        year,
        semester,
        course_id,
      },
    });
    res.status(201).json(student_plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Student Plans
exports.getStudentPlans = async (req, res) => {
  try {
    const studentplans = await prisma.studentplan.findMany({
      include: {
        section: true, // ดึงข้อมูล section ที่เกี่ยวข้อง
      },
    });

    // ใช้ reduce เพื่อจัดกลุ่ม studentplan ตาม sec_name และนับจำนวน
    const groupedStudentPlans = studentplans.reduce((acc, plan) => {
      const secName = plan.section.sec_name; // ดึง sec_name จาก section ที่เกี่ยวข้อง
      if (!acc[secName]) {
        acc[secName] = 0;
      }
      acc[secName]++;
      return acc;
    }, {});

    res.status(200).json(groupedStudentPlans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getStudentplanBySec = async (req, res) => {
  try {
    const { sec_id } = req.params;

    const studentplans = await prisma.studentplan.findMany({
      where: { sec_id: Number(sec_id) },
      include: {
        course: true, // Include course data
      },
    });

    const groupedCourses = studentplans.reduce((acc, studentplan) => {
      const key = `Semester ${studentplan.semester}, Year ${studentplan.semester}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        ...studentplan.course, //  spread operator properties of the course object
      });
      return acc;
    }, {});

    res.status(200).json(groupedCourses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Student Plan
exports.updateStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const { sec_id, year, semester, course_id } = req.body;
    const student_plan = await prisma.studentplan.update({
      where: { studentplan_id: Number(studentplan_id) },
      data: {
        sec_id,
        year,
        semester,
        course_id,
      },
    });
    res.status(200).json(student_plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Student Plan
exports.deleteStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const student_plan = await prisma.studentplan.delete({
      where: { studentplan_id: Number(studentplan_id) },
    });
    res.status(200).json(student_plan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
