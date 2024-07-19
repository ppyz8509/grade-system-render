const { PrismaClient } = require('@prisma/client');
const prisma = require('../models/prisma');


//Major
exports.createMajor = async (req, res) => {
  const { major } = req.body;

  try {
    const newMajor = await prisma.major.create({
      data: {

        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        majorCode: major.majorCode,
        majorStatus: major.majorStatus,
        majorSupervisor: major.majorSupervisor,
      }
    });

    return res.status(201).json({ newMajor });
  } catch (error) {
    console.error('Error creating major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create major', details: error.message });
  }
};
exports.getallMajor = async (req, res) => {
  try {
    const majors = await prisma.major.findMany({});

    res.status(200).json({ majors });
  } catch (error) {
    console.error('Error fetching majors:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch majors', details: error.message });
  }
};
exports.updateMajor = async (req, res) => {
  const { id } = req.params;
  const { major } = req.body;

  try {
    const existingMajor = await prisma.major.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMajor) {
      return res.status(404).json({ error: `Major with ID ${id} not found` });
    }

    const updatedMajor = await prisma.major.update({
      where: { id: parseInt(id) },
      data: {
        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        majorStatus: major.majorStatus,
        majorSupervisor: major.majorSupervisor,
      },
    });

    return res.status(200).json({ message: `Major with ID ${id} has been updated successfully`, updatedMajor });
  } catch (error) {
    console.error('Error updating major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update major', details: error.message });
  }
};
exports.deleteMajor = async (req, res) => {
  const { id } = req.params;

  try {
    const existingMajor = await prisma.major.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingMajor) {
      return res.status(404).json({ error: `Major with ID ${id} not found` });
    }

    await prisma.category.deleteMany({
      where: { majorId: parseInt(id) }
    });


    await prisma.major.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: `Major with ID ${id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete major', details: error.message });
  }
};


///Category
exports.createCategory = async (req, res) => {
  const { category } = req.body;

  try {
    const newCategory = await prisma.category.create({
      data: {
        majorId: category.majorId,
        categoryName: category.categoryName,
        categoryUnit: category.categoryUnit,
      }
    });

    return res.status(201).json({ newCategory });
  } catch (error) {
    console.error('Error creating category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create category', details: error.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error retrieving categories:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to retrieve categories', details: error.message });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with ID ${id} not found` });
    }
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        majorId: category.majorId,
        categoryName: category.categoryName,
        categoryUnit: category.categoryUnit,
      }
    });

    return res.status(200).json({ updatedCategory });
  } catch (error) {
    console.error('Error updating category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update category', details: error.message });
  }
};
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {

    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!category) {
      return res.status(404).json({ error: `Category with ID ${id} not found` });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) }
    });

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete category', details: error.message });
  }
};


///Group
exports.createGroup = async (req, res) => {
  const { group } = req.body;

  try {
    const newGroup = await prisma.group.create({
      data: {
        groupName: group.groupName,
        groupUnit: group.groupUnit,
        categoryId: group.categoryId,
      }
    });

    return res.status(201).json({ newGroup });
  } catch (error) {
    console.error('Error creating group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create group', details: error.message });
  }
};
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany();
    return res.status(200).json({ groups });
  } catch (error) {
    console.error('Error retrieving groups:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to retrieve groups', details: error.message });
  }
};
exports.updateGroup = async (req, res) => {
  const { id } = req.params;
  const { group } = req.body;

  try {
    // Check if group with given ID exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: `Group with ID ${id} not found` });
    }

    // Check if categoryId exists in category table
    const existingCategory = await prisma.category.findUnique({
      where: { id: group.categoryId },
    });

    if (!existingCategory) {
      return res.status(400).json({ error: `Category with ID ${group.categoryId} does not exist` });
    }

    // Update group
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: {
        groupName: group.groupName,
        groupUnit: group.groupUnit,
        categoryId: group.categoryId,
      }
    });

    return res.status(200).json({ updatedGroup });
  } catch (error) {
    console.error('Error updating group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update group', details: error.message });
  }
};
exports.deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if group with given ID exists
    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: `Group with ID ${id} not found` });
    }

    // Delete group
    await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: `Group with ID ${id} has been deleted` });
  } catch (error) {
    console.error('Error deleting group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete group', details: error.message });
  }
};


///Course
exports.createCourse = async (req, res) => {
  const { course } = req.body;

  try {
    const newCourse = await prisma.course.create({
      data: {
        courseCode: course.courseCode,
        courseNameTH: course.courseNameTH,
        courseNameENG: course.courseNameENG,
        courseYear: course.courseYear,
        courseUnit: course.courseUnit,
        majorId: course.majorId,
      }
    });

    return res.status(201).json({ newCourse });
  } catch (error) {
    console.error('Error creating course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create course', details: error.message });
  }
};
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();
    return res.status(200).json({ courses });
  } catch (error) {
    console.error('Error retrieving courses:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to retrieve courses', details: error.message });
  }
};
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course } = req.body;

  try {
    // Check if course with given ID exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: `Course with ID ${id} not found` });
    }

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
      data: {
        courseCode: course.courseCode,
        courseNameTH: course.courseNameTH,
        courseNameENG: course.courseNameENG,
        courseYear: course.courseYear,
        courseUnit: course.courseUnit,
        majorId: course.majorId,
      }
    });

    return res.status(200).json({ updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update course', details: error.message });
  }
};
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if course with given ID exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCourse) {
      return res.status(404).json({ error: `Course with ID ${id} not found` });
    }

    // Delete course
    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: `Course with ID ${id} has been deleted` });
  } catch (error) {
    console.error('Error deleting course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete course', details: error.message });
  }
};


