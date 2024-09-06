const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createStudentPlan = async (req, res) => {
  try {
    const { major_id, year, semester, course_id } = req.body;

    if (!major_id || !year || !semester || !course_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const student_plan = await prisma.studentplan.create({
      data: {
        major_id,
        year,
        semester,
        course_id,
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
    const studentplans = await prisma.studentplan.findMany({
      include: {
        section: true, // ดึงข้อมูล section ที่เกี่ยวข้อง
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
