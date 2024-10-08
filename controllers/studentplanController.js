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
    const { year, semester, major_id } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!year || !semester|| !major_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = getUserFromToken(token);
    console.log(user);

    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const checkmajor = await prisma.major.findUnique({
      where: { major_id: Number(major_id)}
    })
    if (!checkmajor) {
      return res.status(403).json({ message: 'major not found' });
    }

    const existingCourse = await prisma.studentplan.findFirst({
      where: {
        year: year,
        semester: semester,
        major_id: major_id,
        academic_id: user.academic.academic_id,
      },
    });

    if (existingCourse) {
      return res.status(400).json({ message: 'Student plan already exists ' });
    }

    const student_plan = await prisma.studentplan.create({
      data: {
        year,
        semester,
        major_id,
        academic_id: user.academic.academic_id,
      },
    });
    return res.status(201).json(student_plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.createListStudentplan = async (req, res) => {
  try {
    const {studentplan_id} = req.params;
    const { course_id  } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (isNaN(studentplan_id)) {
      return res.status(400).json({ message: 'Invalid studentplan_id ' });
    }
    const user = getUserFromToken(token);
    console.log(user);

    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const studentplan = await prisma.studentplan.findUnique({
      where: { studentplan_id: Number(studentplan_id) },
    });
    console.log(studentplan);
    
    const course = await prisma.course.findUnique({
      where: { course_id: String(course_id) },
    });
    if (!course) {
      return res.status(404).json({ message: 'course not found' });
    } 

    if (!studentplan) {
      return res.status(404).json({ message: 'studentplan not found' });
    } 
    if (!course_id ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (studentplan.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Academic ID mismatch' });
    }

        // ตรวจสอบว่า Listcoursestudentplan ที่มี course_id และ studentplan_id นี้มีอยู่แล้วหรือไม่
        const existingListStudentplan = await prisma.listcoursestudentplan.findFirst({
          where: {
            course_id: course_id,
            academic_id: user.academic.academic_id,
          },
        });
    
        if (existingListStudentplan) {
            return res.status(400).json({ message: 'Course already exists in the academic ID' });
        }


 
    const liststudent_plan = await prisma.listcoursestudentplan.create({
      data: {
        course_id,
        studentplan_id: Number(studentplan_id),
        academic_id: user.academic.academic_id,
      },
    });
    return res.status(201).json(liststudent_plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStudentPlans = async (req, res) => {
  try {
    const studentplans = await prisma.studentplan.findMany({
      include: {
        Listcoursestudentplan: {
          include: {
            course: {
              select: {
                courseNameTH: true
              }
            }
          }
        }
      }
    });
    if (studentplans.length === 0) {
      return res.status(404).json({ message: 'studentplans have no' });
    }
    return res.status(200).json(studentplans);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
exports.getStudentplanById = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    
    if (isNaN(studentplan_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const studentplan = await prisma.studentplan.findUnique({
      where: { studentplan_id: Number(studentplan_id) },
      include: {
        Listcoursestudentplan: {
          include: {
            course: {
              select: {
                courseNameTH: true
              }
            }
          }
        }
      }
    });
    
    if (!studentplan) {
      return res.status(404).json({ message: 'studentplan not found' });
    } 
   
    return res.status(200).json(studentplan);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getStudentplanByAcademic = async (req, res) => {
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
      include: {
        Listcoursestudentplan: {
          select:{ course_id: true}
        }
      }
    });
    if (studentplans.length === 0) {
      return res.status(404).json({ message: 'studentplans have no' });
    }

    res.status(200).json(studentplans);
  } catch (error) {
    console.error('Error fetching student plans:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const { year, semester } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (isNaN(studentplan_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const studentplanExists = await prisma.studentplan.findUnique({
      where: { studentplan_id: Number(studentplan_id) },
    });

    if (!studentplanExists) {
      return res.status(404).json({ message: 'studentplan not found' });
    }

    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (studentplanExists.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }

    const student_plan = await prisma.studentplan.update({
      where: { studentplan_id: Number(studentplan_id) },
      data: {
        year,
        semester,
      },
    });
    return res.status(200).json(student_plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteStudentPlan = async (req, res) => {
  try {
    const { studentplan_id } = req.params;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!studentplan_id) {
      return res.status(400).json({ message: 'Missing studentplan_id' });
    }

    if (isNaN(studentplan_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const studentplanExists = await prisma.studentplan.findUnique({
      where: { studentplan_id: Number(studentplan_id) },
    });

    if (!studentplanExists) {
      return res.status(404).json({ message: 'studentplan not found' });
    }

    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (studentplanExists.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }
    await prisma.listcoursestudentplan.deleteMany({
      where: { studentplan_id: Number(studentplan_id) },
    });

    await prisma.register.deleteMany({
      where: { studentplan_id: Number(studentplan_id) },
    });


    const student_plan = await prisma.studentplan.delete({
      where: { studentplan_id: Number(studentplan_id) },
    });
    return res.status(200).json(student_plan);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteListStudentplan = async (req,res) => {
  try {
  const {Listcoursestudentplan_id} = req.params;
  if (!Listcoursestudentplan_id) {
    return res.status(400).json({ message: 'Missing studentplan_id' });
  }

  if (isNaN(Listcoursestudentplan_id)) {
    return res.status(400).json({ message: 'ID is not number' });
  }

  const ListstudentplanExists = await prisma.listcoursestudentplan.findUnique({
    where: { Listcoursestudentplan_id: Number(Listcoursestudentplan_id) },
  });

  if (!ListstudentplanExists) {
    return res.status(404).json({ message: 'listcoursestudentplan not found' });
  }

  const listcoursestudentplanDelete = await prisma.listcoursestudentplan.delete({
    where: { Listcoursestudentplan_id: Number(Listcoursestudentplan_id) },
  });
  return res.status(200).json(listcoursestudentplanDelete);
} catch (error) {
  return res.status(500).json({ error: error.message });
}
};
