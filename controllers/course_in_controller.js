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

exports.createCourseIn = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }

    const existingCourseIn = await prisma.course_in.findUnique({ where: { username } });
    if (existingCourseIn) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = getUserFromToken(token);
    console.log(user);
    
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const courseIn = await prisma.course_in.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
        academic_id: user.academic.academic_id, // Use academic_id from the token
      },
    });

    res.status(201).json(courseIn);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getCourseIns = async (req, res) => {
  try {
    const courseIns = await prisma.course_in.findMany();
    if (courseIns.length === 0) {
      return res.status(404).json({ message: 'Admin have no' });
    }
    return res.status(200).json(courseIns);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getCourseInById = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    const courseIn = await prisma.course_in.findUnique({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    if (!courseIn) {
      return res.status(404).json({ message: 'Course Instructor not found' });
    } 
   
    return res.status(200).json(courseIn);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }

    const CourseInExists = await prisma.course_in.findUnique({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    if (!CourseInExists) {
      return res.status(404).json({ message: 'CourseIn not found' });
    }

    const courseIn = await prisma.course_in.update({
      where: { courseinstructor_id: Number(courseinstructor_id) },
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      },
    });

    res.status(200).json(courseIn);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const CourseInExists = await prisma.course_in.findUnique({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    if (!CourseInExists) {
      return res.status(404).json({ message: 'CourseIn not found' });
    }


    const courseIn = await prisma.course_in.delete({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    return res.status(200).json(courseIn);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
