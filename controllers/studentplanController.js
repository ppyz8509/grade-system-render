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
    const student_plans = await prisma.studentplan.findMany();
    res.status(200).json(student_plans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Student Plan
exports.getStudentPlanById = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const student_plan = await prisma.studentplan.findUnique({
      where: { studentplan_id: Number(studentplan_id) },
    });
    if (student_plan) {
      res.status(200).json(student_plan);
    } else {
      res.status(404).json({ message: 'Student Plan not found' });
    }
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

exports.getStudentplan = async (req, res) => {
    try {
      const { sec_id } = req.params;
  
      const studentplans = await prisma.studentplan.findMany({
        where: { sec_id: Number(sec_id) },
        include: {
          course: true, // Include course data
        },
      });
  
      const groupedCourses = studentplans.reduce((acc, studentplan) => {
        const key = `Semester ${studentplan.semester}, Year ${studentplan.year}`;
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