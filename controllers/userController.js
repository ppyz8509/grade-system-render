const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



exports.createUser = async (req, res) => {
  console.log("Request Body:", req.body);

  const { name, username, password, role } = req.body;

  // ตรวจสอบ role
  if (!role || !['ADMIN', 'COURSE_INSTRUCTOR'].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // ตรวจสอบการมีอยู่ของ username
  let existingUser;
  if (role === 'ADMIN') {
    existingUser = await prisma.admin.findFirst({
      where: { A_username: username },
    });
  } else if (role === 'COURSE_INSTRUCTOR') {
    existingUser = await prisma.courseInstructor.findFirst({
      where: { C_username: username },
    });
  }

  if (existingUser) {
    return res.status(400).json({ message: "Username already exists" });
  }

  // ตรวจสอบข้อมูลที่จำเป็น
  if (!name) {
    return res.status(400).json({ message: "No name provided" });
  }
  if (!username) {
    return res.status(400).json({ message: "No username provided" });
  }
  if (!password) {
    return res.status(400).json({ message: "No password provided" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let newUser;
    if (role === 'ADMIN') {
      newUser = await prisma.admin.create({
        data: {
          A_firstname: name.split(' ')[0], // แยกชื่อจากชื่อเต็ม
          A_lastname: name.split(' ')[1] || '', // นามสกุล
          A_username: username,
          A_password: hashedPassword,
          role,
        },
      });
    } else if (role === 'COURSE_INSTRUCTOR') {
      newUser = await prisma.courseInstructor.create({
        data: {
          C_firstname: name.split(' ')[0], // แยกชื่อจากชื่อเต็ม
          C_lastname: name.split(' ')[1] || '', // นามสกุล
          C_username: username,
          C_password: hashedPassword,
          role,
        },
      });
    }

    return res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ error: error.message });
  }
};
// getAllUser
exports.getAllUser = async (req, res) => {
  try {
    // ดึงข้อมูล Admin
    const admins = await prisma.admin.findMany();

    // ดึงข้อมูล Course Instructors
    const courseInstructors = await prisma.courseInstructor.findMany();

    // ดึงข้อมูล Students
    const students = await prisma.student.findMany({
      include: {
        classroom: true,  
      },
    });

    // ดึงข้อมูล Teachers
    const teachers = await prisma.teacher.findMany({
      include: {
        advisorrooms: true,
      },
    });

    // รวมข้อมูลผู้ใช้ทั้งหมด
    const users = [
      ...admins.map(admin => ({ ...admin, role: 'ADMIN' })),
      ...courseInstructors.map(instructor => ({ ...instructor, role: 'COURSE_INSTRUCTOR' })),
      ...students.map(student => ({ ...student, role: 'STUDENT' })),
      ...teachers.map(teacher => ({ ...teacher, role: 'TEACHER' })),
    ];

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(400).json({ error: error.message });
  }
};
// Get Roles 
exports.getRole = async (req, res) => {
  const { role } = req.params;

  try {
    const users = await prisma.user.findMany({
      where: {
        role: role.toUpperCase() // เปลี่ยนบทบาทให้เป็นตัวพิมพ์ใหญ่ทั้งหมด
      },
      include: {
        studentInfo: {
          include: {
            studentPlan: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(400).json({ error: "Error fetching users by role" });
  }
};
// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password: hashedPassword || existingUser.password,
        role, // อัปเดตข้อมูล role
      },
    });

    res.status(200).json({ message: `User with ID ${id} has been updated successfully` });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};
// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    let existingUser;

    // ตรวจสอบในแต่ละโมเดล
    existingUser = await prisma.admin.findUnique({
      where: { Admin_id: parseInt(id) },
    }) || await prisma.courseInstructor.findUnique({
      where: { C_id: parseInt(id) },
    }) || await prisma.student.findUnique({
      where: { S_id: parseInt(id) },
    }) || await prisma.teacher.findUnique({
      where: { T_id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    // ลบข้อมูลที่เกี่ยวข้อง (ถ้ามี)
    if (existingUser.role === 'STUDENT') {
      await prisma.studentInfo.deleteMany({
        where: { studentsId: existingUser.S_id },
      });
    }

    // ลบผู้ใช้ตามบทบาท
    if (existingUser.role === 'ADMIN') {
      await prisma.admin.delete({
        where: { Admin_id: existingUser.Admin_id },
      });
    } else if (existingUser.role === 'COURSE_INSTRUCTOR') {
      await prisma.courseInstructor.delete({
        where: { C_id: existingUser.C_id },
      });
    } else if (existingUser.role === 'STUDENT') {
      await prisma.student.delete({
        where: { S_id: existingUser.S_id },
      });
    } else if (existingUser.role === 'TEACHER') {
      await prisma.teacher.delete({
        where: { T_id: existingUser.T_id },
      });
    }

    res.status(200).json({ message: `User with ID ${id} has been deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400).json({ error: error.message });
  }
};




