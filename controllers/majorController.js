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
    'Major_id',
    'status'
  ];

  for (const field of requiredFields) {
    if (!major[field]) {
      return res.status(400).json({ error: `Missing required field: ${field}` });
    }
  }

  // Validate Major_id length
  if (major.Major_id.length !== 14) {
    return res.status(400).json({ error: 'Major_id must be exactly 14 characters long' });
  }

  // Validate status
  const validStatuses = ['ACTIVE', 'INACTIVE'];
  if (!validStatuses.includes(major.status)) {
    return res.status(400).json({ error: 'Invalid status. Must be either ACTIVE or INACTIVE' });
  }

  try {
    // ตรวจสอบ Major_id ว่ามีอยู่แล้วหรือไม่
    const existingMajor = await prisma.major.findUnique({
      where: { Major_id: major.Major_id },
    });

    if (existingMajor) {
      return res.status(400).json({ error: `Major with ID ${major.Major_id} already exists` });
    }

    const newMajor = await prisma.major.create({
      data: {
        Major_id: major.Major_id,
        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        status: major.status,
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
      where: { Major_id: id }, // ใช้ Major_id แทน id
      include: {
        categories: {
          include: {
            groups: {
              include: {
                courses: true, // รวม Courses สำหรับแต่ละ Group
              },
            },
            courses: true, // รวม Courses สำหรับแต่ละ Category
          },
        },
      },
    });

    if (!major) {
      return res.status(404).json({ error: 'Major not found' });
    }

    // ฟังก์ชันสำหรับกรอง Course ที่ซ้ำกันออก
    const filterCourses = (categories) => {
      const courseSet = new Set();
      categories.forEach(category => {
        // ฟิลเตอร์ Courses ที่เชื่อมโยงกับ Group
        category.groups.forEach(group => {
          group.courses = group.courses.filter(course => {
            if (courseSet.has(course.Course_id)) {
              return false;
            } else {
              courseSet.add(course.Course_id);
              return true;
            }
          });
        });

        // ฟิลเตอร์ Courses ที่เชื่อมโยงกับ Category
        category.courses = category.courses.filter(course => {
          if (courseSet.has(course.Course_id)) {
            return false;
          } else {
            courseSet.add(course.Course_id);
            return true;
          }
        });

        // ตัด `courses` ออกจาก `Category` หากเป็น [] และไม่มี `groups`
        if (category.courses.length === 0 && category.groups.length === 0) {
          delete category.courses;
        }
      });
    };

    // กรอง Course ที่ซ้ำกันออก
    filterCourses(major.categories);

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
    // Check status if provided in request
    if (major.status) {
      const validStatuses = ['ACTIVE', 'INACTIVE'];
      if (!validStatuses.includes(major.status)) {
        return res.status(400).json({ error: 'Invalid status. Must be either ACTIVE or INACTIVE' });
      }
    }

    const updatedMajor = await prisma.major.update({
      where: { Major_id: id },
      data: {
        majorNameTH: major.majorNameTH,
        majorNameENG: major.majorNameENG,
        majorYear: major.majorYear,
        majorUnit: major.majorUnit,
        status: major.status,
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
      where: { Major_id: id },
      include: {
        categories: {
          include: {
            groups: true, 
          },
        },
      },
    });

    if (!major) {
      return res.status(404).json({ error: 'Major not found' });
    }
   
    // ลบข้อมูลที่เกี่ยวข้องทั้งหมด
    await prisma.course.deleteMany({
      where: { majorId: id },
    });

    await prisma.group.deleteMany({
      where: { categoryId: { in: major.categories.map(category => category.id) } },
    });

    await prisma.category.deleteMany({
      where: { majorId: id },
    });

    await prisma.major.delete({
      where: { Major_id: id },
    });

    return res.status(200).json({ message: 'Major deleted successfully' });
  } catch (error) {
    console.error('Error deleting major:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to delete major', details: error.message });
  }
};

//Category
exports.createCategory = async (req, res) => {
  const { category } = req.body;

  try {
    // ตรวจสอบความมีอยู่ของ Major โดยใช้ Major_id
    const majorExists = await prisma.major.findUnique({
      where: { Major_id: category.majorId },
    });

    if (!majorExists) {
      return res.status(404).json({ error: `Major with ID ${category.majorId} not found` });
    }

    // สร้าง Category ใหม่
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
        groups: true, // รวมข้อมูลของ groups โดยไม่รวม subgroups
      },
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

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
    // ตรวจสอบการมีอยู่ของ Category ก่อนอัปเดต
    const existingCategory = await prisma.category.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // อัปเดต Category
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
    // ค้นหา Category โดยไม่รวมข้อมูลที่ไม่มีใน Prisma Schema
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        groups: {
          include: {
            courses: true,  // รวมข้อมูล courses ที่เกี่ยวข้องกับกลุ่ม
          },
        },
        courses: true,  // รวมข้อมูล courses ที่เกี่ยวข้องกับ Category
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

//Group
exports.createGroup = async (req, res) => {
  const { group } = req.body;

  try {
    // ตรวจสอบ Category ก่อน
    const existingCategory = await prisma.category.findUnique({
      where: { id: group.categoryId },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: `Category with ID ${group.categoryId} not found` });
    }

    // ตรวจสอบว่า Group ที่มีอยู่แล้วหรือไม่ โดยใช้ `groupName` และ `categoryId`
    const existingGroup = await prisma.group.findFirst({
      where: {
        groupName: group.groupName,
        categoryId: group.categoryId,
      },
    });

    if (existingGroup) {
      return res.status(400).json({ error: `Group with name ${group.groupName} in Category ${group.categoryId} already exists` });
    }

    // สร้าง Group ใหม่
    const newGroup = await prisma.group.create({
      data: {
        groupName: group.groupName,
        groupUnit: group.groupUnit,
        categoryId: group.categoryId,
      },
    });

    return res.status(201).json({ newGroup });
  } catch (error) {
    console.error('Error creating group:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to create group', details: error.message });
  }
};
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await prisma.group.findMany({
      include: {
        category: true, 
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
        // parentGroupId ถูกลบออกจาก Schema ถ้าไม่มีให้ใช้ null
        // ตรวจสอบว่า parentGroupId ถูกต้องหรือไม่ถ้าคุณมีมันอยู่ใน schema
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
        courses: true,  // รวมข้อมูล course ที่เชื่อมโยงกับ group
      },
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // ลบข้อมูลที่มีความสัมพันธ์ก่อน
    await prisma.course.deleteMany({
      where: { groupId: parseInt(id) },
    });

    // ลบกลุ่มที่ระบุ
    await prisma.group.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting group:', error.message, error.stack);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete group due to foreign key constraint', details: error.message });
    }
    res.status(500).json({ error: 'Unable to delete group', details: error.message });
  }
};




//Course
exports.createCourse = async (req, res) => {
  const { course } = req.body;

  try {
    // ตรวจสอบ Major ที่มีอยู่
    const existingMajor = await prisma.major.findUnique({
      where: { Major_id: course.majorId },
    });

    // ตรวจสอบ Category ที่มีอยู่
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
      // ตรวจสอบ Group ที่มีอยู่
      existingGroup = await prisma.group.findUnique({
        where: { id: course.groupId },
      });

      if (!existingGroup) {
        return res.status(404).json({
          error: `Group with ID ${course.groupId} not found`,
        });
      }
    }

    // ตรวจสอบ Course_id ว่ามีอยู่แล้วหรือไม่
    const existingCourse = await prisma.course.findUnique({
      where: { Course_id: course.Course_id },
    });

    if (existingCourse) {
      return res.status(400).json({ error: `Course with ID ${course.Course_id} already exists` });
    }

    // สร้าง Course ใหม่
    const newCourse = await prisma.course.create({
      data: {
        Course_id: course.Course_id,
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
    const courses = await prisma.course.findMany({
      include: {
        major: true,
        category: true,
        group: true,
      },
    });

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
      where: { Course_id: id },  // ใช้ Course_id เป็นฟิลด์หลัก
      include: {
        major: true,
        category: true,
        group: true,
      },
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
    // ตรวจสอบข้อมูลที่รับมาว่ามีความถูกต้องหรือไม่
    if (!course.courseNameTH || !course.courseNameENG || !course.courseYear || !course.courseUnit) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // อัปเดต course 
    const updatedCourse = await prisma.course.update({
      where: { Course_id: id },  // ใช้ Course_id เป็นฟิลด์หลัก
      data: {
        courseNameTH: course.courseNameTH,
        courseNameENG: course.courseNameENG,
        courseYear: course.courseYear,
        courseUnit: course.courseUnit,
      },
    });

    return res.status(200).json({ updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error.message, error.stack);
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Duplicate data error', details: error.message });
    } else if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Record not found', details: error.message });
    }
    res.status(500).json({ error: 'Unable to update course', details: error.message });
  }
};
exports.deleteCourse = async (req, res) => {
  const { id } = req.params;

  try {
    const course = await prisma.course.findUnique({
      where: { Course_id: id },  // ใช้ Course_id เป็นฟิลด์หลัก
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await prisma.course.delete({
      where: { Course_id: id },  // ใช้ Course_id เป็นฟิลด์หลัก
    });

    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error.message, error.stack);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete course due to foreign key constraint', details: error.message });
    }
    res.status(500).json({ error: 'Unable to delete course', details: error.message });
  }
};








// GET CATEGORY BY MAJORID
exports.getCategoriesByMajorId = async (req, res) => {
  const { majorId } = req.params;

  try {
    const categories = await prisma.category.findMany({
      where: { majorId: majorId },  // ใช้ majorId เป็น String
    });

    return res.status(200).json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch categories', details: error.message });
  }
};


// GET GROUP BY CATEGORY ID 
exports.getGroupsByCategoryId = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // แปลง categoryId เป็น Int ก่อนที่จะใช้ในคำสั่งค้นหา
    const intCategoryId = parseInt(categoryId, 10);

    const groups = await prisma.group.findMany({
      where: { categoryId: intCategoryId },  // ใช้ categoryId เป็น Int
      include: {
        courses: true,
      },
    });

    if (!groups.length) {
      return res.status(404).json({ error: 'Groups not found for the given category ID' });
    }

    return res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error.message, error.stack);
    res.status(500).json({ error: 'Unable to fetch groups', details: error.message });
  }
};




// GET COURSES BY GROUP ID
exports.getCoursesByGroupId = async (req, res) => {
  const { groupId } = req.params;

  try {
    // แปลง groupId เป็น Int ก่อนที่จะใช้ในคำสั่งค้นหา
    const intGroupId = parseInt(groupId, 10);

    const courses = await prisma.course.findMany({
      where: { groupId: intGroupId },  // ใช้ groupId เป็น Int
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



