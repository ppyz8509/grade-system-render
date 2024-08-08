const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a Section
exports.createSection = async (req, res) => {
  try {
    const { sec_name, major_id } = req.body;
    const section = await prisma.section.create({
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(201).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Sections
exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Section
exports.getSectionById = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const section = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    if (section) {
      res.status(200).json(section);
    } else {
      res.status(404).json({ message: 'Section not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Section
exports.updateSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const { sec_name, major_id } = req.body;
    const section = await prisma.section.update({
      where: { sec_id: Number(sec_id) },
      data: {
        sec_name,
        major_id,
      },
    });
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a Section
exports.deleteSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const section = await prisma.section.delete({
      where: { sec_id: Number(sec_id) },
    });
    res.status(200).json(section);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Create a Course Instructor
exports.createCourseIn = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email } = req.body;
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
    res.status(500).json({ error: error.message });
  }
};

// Read All Course Instructors
exports.getCourseIns = async (req, res) => {
  try {
    const courseIns = await prisma.course_in.findMany();
    res.status(200).json(courseIns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Course Instructor
exports.getCourseInById = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;
    const courseIn = await prisma.course_in.findUnique({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });
    if (courseIn) {
      res.status(200).json(courseIn);
    } else {
      res.status(404).json({ message: 'Course Instructor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a Course Instructor
exports.updateCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;
    const { username, password, firstname, lastname, phone, email } = req.body;
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
    res.status(500).json({ error: error.message });
  }
};

// Delete a Course Instructor
exports.deleteCourseIn = async (req, res) => {
  try {
    const { courseinstructor_id } = req.params;
    const courseIn = await prisma.course_in.delete({
      where: { courseinstructor_id: Number(courseinstructor_id) },
    });
    res.status(200).json(courseIn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
