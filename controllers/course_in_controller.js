// Create a Section
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSection = async (req, res) => {
  try {
    const { sec_name, major_id } = req.body;
    
    if (!sec_name || !major_id) {
      return res.status(400).json({ message: 'Section name and major_id are required' });
    }
    
    const section = await prisma.section.create({
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(201).json(section);
  } catch (error) {
    console.error('Error creating section:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany();
    res.status(200).json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const { sec_id } = req.params;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const section = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    console.error('Error fetching section by ID:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const { sec_name, major_id } = req.body;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    if (!sec_name || !major_id) {
      return res.status(400).json({ message: 'Section name and major_id are required' });
    }
    
    const section = await prisma.section.update({
      where: { sec_id: Number(sec_id) },
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(200).json(section);
  } catch (error) {
    console.error('Error updating section:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const section = await prisma.section.delete({
      where: { sec_id: Number(sec_id) },
    });
    res.status(200).json(section);
  } catch (error) {
    console.error('Error deleting section:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Section not found' });
    }
    res.status(500).json({ error: error.message });
  }
};


exports.createCourseIn = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const courseIn = await prisma.course_in.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      },
    });
    res.status(201).json(courseIn);
  } catch (error) {
    console.error('Error creating course instructor:', error); 
    //P2002 ใช้เมื่อลองบันทึกข้อมูลที่ขัดแย้งกับข้อกำหนด Uniqueness Constraint (เช่น username ที่ซ้ำกัน)
    if (error.code === 'P2002') { 
      return res.status(409).json({ message: 'Username already exists' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseIns = async (req, res) => {
  try {
    const courseIns = await prisma.course_in.findMany();
    res.status(200).json(courseIns);
  } catch (error) {
    console.error('Error fetching course instructors:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.getCourseInById = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'Invalid courseinstructor_id' });
    }
    const courseIn = await prisma.course_in.findUnique({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    if (courseIn) {
      res.status(200).json(courseIn);
    } else {
      res.status(404).json({ message: 'Course Instructor not found' });
    }
  } catch (error) {
    console.error('Error fetching course instructor by ID:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.updateCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'Invalid courseinstructor_id' });
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
    console.error('Error updating course instructor:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Course Instructor not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;

    if (isNaN(courseinstructor_id)) {
      return res.status(400).json({ message: 'Invalid courseinstructor_id' });
    }

    const courseIn = await prisma.course_in.delete({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });

    res.status(200).json(courseIn);
  } catch (error) {
    console.error('Error deleting course instructor:', error); 
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Course Instructor not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
