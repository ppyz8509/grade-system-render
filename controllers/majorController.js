const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Major
exports.createMajor = async (req, res) => {
  const { major } = req.body;

  const requiredFields = [
    'majorNameTH',
    'majorNameENG',
    'majorYear',
    'majorUnit',
    'majorCode',
    'majorSupervisor',
    'status'
  ];

  for (const field of requiredFields) {
    if (!major[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // ตรวจสอบ majorCode
  if (major.majorCode.length !== 14) {
    return res.status(400).json({ error: 'majorCode must be exactly 14 digits long' });
  }

  // ตรวจสอบ status
  const validStatuses = ['ACTIVE', 'INACTIVE'];
  if (!validStatuses.includes(major.status)) {
    return res.status(400).json({ error: 'Invalid status. Must be either ACTIVE or INACTIVE' });
  }

  try {
    const newMajor = await prisma.major.create({
      data: {
        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        majorCode: major.majorCode,
        status: major.status,
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

    // ฟังก์ชันสำหรับกรอง Course ที่ซ้ำกันออก
    const filterCourses = (groups) => {
      const courseSet = new Set();
      groups.forEach(group => {
        group.courses = group.courses.filter(course => {
          if (courseSet.has(course.id)) {
            return false;
          } else {
            courseSet.add(course.id);
            return true;
          }
        });
        group.subgroups.forEach(subgroup => filterCourses([subgroup]));
      });
    };

    // จัดกลุ่มและจัดเรียงกลุ่มในแต่ละ category
    major.categories.forEach(category => {
      category.groups = organizeGroups(category.groups);
      filterCourses(category.groups); // กรอง Course ที่ซ้ำกันออก
    });

    return res.status(200).json({ major });
  } catch (error) {
    console.error('Error fetching major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch major', details: error.message });
  }
};
exports.getAllMajors = async (req, res) => {
  try {
    const majors = await prisma.major.findMany();

    return res.status(200).json({ majors });
  } catch (error) {
    console.error('Error fetching majors:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch majors', details: error.message });
  }
};
exports.updateMajor = async (req, res) => {
  const { id } = req.params;
  const { major } = req.body;

  try {
    // ตรวจสอบ status ถ้ามีการส่งมาใน request
    if (major.status) {
      const validStatuses = ['ACTIVE', 'INACTIVE'];
      if (!validStatuses.includes(major.status)) {
        return res.status(400).json({ error: 'Invalid status. Must be either ACTIVE or INACTIVE' });
      }
    }

    const updatedMajor = await prisma.major.update({
      where: { id: parseInt(id) },
      data: {
        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        majorCode: major.majorCode,
        status: major.status,  
        majorSupervisor: major.majorSupervisor,
      }
    });

    return res.status(200).json({ updatedMajor });
  } catch (error) {
    console.error('Error updating major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update major', details: error.message });
  }
};
exports.deleteMajor = async (req, res) => {
  const { id } = req.params;

  try {
    const major = await prisma.major.findUnique({
      where: { id: parseInt(id) },
      include: {
        categories: {
          include: {
            groups: {
              include: {
                subgroups: true,
              },
            },
          },
        },
      },
    });

    if (!major) {
      return res.status(404).json({ error: 'Major not found' });
    }

    // ลบข้อมูลที่มีความสัมพันธ์ก่อน
    await prisma.course.deleteMany({
      where: { majorId: parseInt(id) },
    });

    await prisma.group.deleteMany({
      where: { categoryId: { in: major.categories.map(category => category.id) } },
    });

    await prisma.category.deleteMany({
      where: { majorId: parseInt(id) },
    });

    await prisma.major.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Major deleted successfully' });
  } catch (error) {
    console.error('Error deleting major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete major', details: error.message });
  }
};


//Course
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
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await prisma.course.findMany();

    return res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch courses', details: error.message });
  }
};
exports.getCourseById = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch course', details: error.message });
  }
};
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { course } = req.body;

  try {
    const updatedCourse = await prisma.course.update({
      where: { id: parseInt(id) },
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

    return res.status(200).json({ updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to update course', details: error.message });
  }
};
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { id: parseInt(id) },
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete course', details: error.message });
  }
};


//Group
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
//Subgroup
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
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        subgroups: true,
      },
    });

    return res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch groups', details: error.message });
  }
};
exports.updateGroup = async (req, res) => {
  const { id } = req.params;
  const { group } = req.body;

  try {
    const updatedGroup = await prisma.group.update({
      where: { id: parseInt(id) },
      data: {
        groupName: group.groupName,
        groupUnit: group.groupUnit,
        categoryId: group.categoryId,
        parentGroupId: group.parentGroupId || null,
      },
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
    const group = await prisma.group.findUnique({
      where: { id: parseInt(id) },
      include: {
        subgroups: true,
        courses: true,
      },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // ลบข้อมูลที่มีความสัมพันธ์ก่อน
    await prisma.course.deleteMany({
      where: { groupId: parseInt(id) },
    });

    await prisma.group.deleteMany({
      where: { parentGroupId: parseInt(id) },
    });

    await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete group', details: error.message });
  }
};


//Category
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
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany();

    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch categories', details: error.message });
  }
};
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        groups: {
          include: {
            subgroups: {
              include: {
              },
            },
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
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
    category.groups = organizeGroups(category.groups);

    return res.status(200).json({ category });
  } catch (error) {
    console.error('Error fetching category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch category', details: error.message });
  }
};
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { category } = req.body;

  try {
    const updatedCategory = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        categoryName: category.categoryName,
        categoryUnit: category.categoryUnit,
        majorId: category.majorId,
      },
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
      include: {
        groups: {
          include: {
            subgroups: true,
            courses: true,
          },
        },
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // ลบข้อมูลที่มีความสัมพันธ์ก่อน
    await prisma.course.deleteMany({
      where: { categoryId: parseInt(id) },
    });

    await prisma.group.deleteMany({
      where: { categoryId: parseInt(id) },
    });

    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete category', details: error.message });
  }
};


// GET CATEGORY BY MAJORID
exports.getCategoriesByMajorId = async (req, res) => {
  const { majorId } = req.params;

  try {
    const categories = await prisma.category.findMany({
      where: { majorId: parseInt(majorId) },
    });

    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch categories', details: error.message });
  }
};

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

// GET GROUP BY CATEGORY ID 
exports.getGroupsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const groups = await prisma.group.findMany({
      where: { categoryId: parseInt(categoryId) },
      include: {
        subgroups: {
          include: {
            courses: true,
          },
        },
        courses: true,
      },
    });

    if (!groups.length) {
      return res.status(404).json({ error: 'Groups not found for the given category ID' });
    }

    const organizedGroups = organizeGroups(groups);

    return res.status(200).json({ groups: organizedGroups });
  } catch (error) {
    console.error('Error fetching groups:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch groups', details: error.message });
  }
};


// GET COURSES BY GROUP ID
exports.getCoursesByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    const courses = await prisma.course.findMany({
      where: { groupId: parseInt(groupId) },
    });

    if (!courses.length) {
      return res.status(404).json({ error: 'Courses not found for the given group ID' });
    }

    return res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch courses', details: error.message });
  }
};



