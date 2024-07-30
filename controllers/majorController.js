const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); // สร้าง PrismaClient ใหม่

// ฟังก์ชันสำหรับสร้าง Major
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
exports.getMajorById = async (req, res) => {
  const { id } = req.params;

  try {
    const major = await prisma.major.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: {
          include: {
            groups: {
              include: {
                subgroups: { 
                  include: {
                    courses: true,
                  },
                },
                courses: true,
              },
            },
            courses: true,
          },
        },
      },
    });

    if (!major) {
      return res.status(404).json({ error: 'Major not found' });
    }

    // ฟังก์ชันสำหรับจัดกลุ่มและจัดเรียงกลุ่ม
    const organizeGroups = (groups) => {
      const groupMap = {};
      const rootGroups = [];

      groups.forEach(group => {
        group.subgroups = [];
        groupMap[group.id] = group;
      });

      groups.forEach(group => {
        if (group.parentGroupId) {
          if (groupMap[group.parentGroupId]) {
            groupMap[group.parentGroupId].subgroups.push(group);
          }
        } else {
          rootGroups.push(group);
        }
      });

      return rootGroups;
    };

    // จัดกลุ่มและจัดเรียงกลุ่มในแต่ละ category
    major.categories.forEach(category => {
      category.groups = organizeGroups(category.groups);
    });

    return res.status(200).json({ major });
  } catch (error) {
    console.error('Error fetching major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch major', details: error.message });
  }
};



// ฟังก์ชันสำหรับสร้าง Course
exports.createCourse = async (req, res) => {
  const { course } = req.body;

  try {
    const existingMajor = await prisma.major.findUnique({
      where: { id: course.majorId },
    });

    const existingCategory = await prisma.category.findUnique({
      where: { id: course.categoryId },
    });

    if (!existingMajor) {
      return res.status(404).json({
        error: `Major with ID ${course.majorId} not found`,
      });
    }

    if (!existingCategory) {
      return res.status(404).json({
        error: `Category with ID ${course.categoryId} not found`,
      });
    }

    let existingGroup = null;
    if (course.groupId) {
      existingGroup = await prisma.group.findUnique({
        where: { id: course.groupId },
      });

      if (!existingGroup) {
        return res.status(404).json({
          error: `Group with ID ${course.groupId} not found`,
        });
      }
    }

    const newCourse = await prisma.course.create({
      data: {
        courseCode: course.courseCode,
        courseNameTH: course.courseNameTH,
        courseNameENG: course.courseNameENG,
        courseYear: course.courseYear,
        courseUnit: course.courseUnit,
        majorId: course.majorId,
        categoryId: course.categoryId,
        groupId: course.groupId || null,
      },
    });

    return res.status(201).json({ newCourse });
  } catch (error) {
    console.error('Error creating course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create course', details: error.message });
  }
};

// ฟังก์ชันสำหรับสร้าง Group
exports.createGroup = async (req, res) => {
  const { group } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: group.categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with ID ${group.categoryId} not found` });
    }

    let existingParentGroup = null;
    if (group.parentGroupId) {
      existingParentGroup = await prisma.group.findUnique({
        where: { id: group.parentGroupId },
      });

      if (!existingParentGroup) {
        return res.status(404).json({ error: `Parent Group with ID ${group.parentGroupId} not found` });
      }
    }

    const newGroup = await prisma.group.create({
      data: {
        groupName: group.groupName,
        groupUnit: group.groupUnit,
        categoryId: group.categoryId,
        parentGroupId: group.parentGroupId || null,
      },
    });

    return res.status(201).json({ newGroup });
  } catch (error) {
    console.error('Error creating group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create group', details: error.message });
  }
};

// ฟังก์ชันสำหรับสร้าง Subgroup
exports.createSubgroup = async (req, res) => {
  const { subgroup } = req.body;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: subgroup.categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with ID ${subgroup.categoryId} not found` });
    }

    let existingParentGroup = null;
    if (subgroup.parentGroupId) {
      existingParentGroup = await prisma.group.findUnique({
        where: { id: subgroup.parentGroupId },
      });

      if (!existingParentGroup) {
        return res.status(404).json({ error: `Parent Group with ID ${subgroup.parentGroupId} not found` });
      }
    }

    const newSubgroup = await prisma.group.create({
      data: {
        groupName: subgroup.groupName,
        groupUnit: subgroup.groupUnit,
        categoryId: subgroup.categoryId,
        parentGroupId: subgroup.parentGroupId || null,
      },
    });

    return res.status(201).json({ newSubgroup });
  } catch (error) {
    console.error('Error creating subgroup:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create subgroup', details: error.message });
  }
};

// ฟังก์ชันสำหรับลบ Group
exports.deleteGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const existingGroup = await prisma.group.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingGroup) {
      return res.status(404).json({ error: `Group with ID ${id} not found` });
    }

    await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: `Group with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete group', details: error.message });
  }
};

// ฟังก์ชันสำหรับสร้าง Category
exports.createCategory = async (req, res) => {
  const { category } = req.body;

  try {
    const majorExists = await prisma.major.findUnique({
      where: { id: category.majorId },
    });

    if (!majorExists) {
      return res.status(404).json({ error: `Major with ID ${category.majorId} not found` });
    }

    const newCategory = await prisma.category.create({
      data: {
        majorId: category.majorId,
        categoryName: category.categoryName,
        categoryUnit: category.categoryUnit,
      },
    });

    return res.status(201).json({ newCategory });
  } catch (error) {
    console.error('Error creating category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create category', details: error.message });
  }
};

// ฟังก์ชันสำหรับลบ Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with ID ${id} not found` });
    }

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: `Category with ID ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete category', details: error.message });
  }
};
