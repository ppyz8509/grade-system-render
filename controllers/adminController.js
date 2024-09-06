const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an Admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingAdmin = await prisma.admin.findUnique({ where: { username } });
    if (existingAdmin) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const admin = await prisma.admin.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      },
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getAdminById = async (req, res) => {
  try {
    const { admin_id } = req.params;


    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'Invalid admin_id' });
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { username, firstname, lastname, phone, email } = req.body;

    // isNaN "is Not-a-Number" ถ้าได้ตัวที่ไม่สามารถเเปลงเป็นตัวเลขได้จะคืนเป็น true ถ้าได้จะคืน false
    if (isNaN(admin_id)) { 
      return res.status(400).json({ message: 'Invalid admin_id' });
    }

    const adminExists = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
    });

    if (!adminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = await prisma.admin.update({
      where: { admin_id: Number(admin_id) },
      data: {
        username,
        firstname,
        lastname,
        phone,
        email,
      },
    });

    res.status(200).json(admin);
  } catch (error) {
    console.error('Error deleting Admin:', error); 
    //P2025 เป็นรหัสข้อผิดพลาดเฉพาะของ Prisma ซึ่งหมายถึง "Record to update not found" หรือ "ไม่พบเรคคอร์ดที่ต้องการอัปเดต"
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(500).json({ error: error.message });
  }
};


exports.deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'Invalid admin_id' });
    }

    const adminExists = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
    });

    if (!adminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const admin = await prisma.admin.delete({
      where: { admin_id: Number(admin_id) },
    });

    res.status(200).json(admin);
  } catch (error) {
    console.error('Error deleting Admin:', error); 
    //P2025 เป็นรหัสข้อผิดพลาดเฉพาะของ Prisma ซึ่งหมายถึง "Record to update not found" หรือ "ไม่พบเรคคอร์ดที่ต้องการอัปเดต"
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

// Create a Teacher
exports.createTeacher = async (req, res) => {
  try {
    const { titlename, firstname, lastname } = req.body;
    const teacher = await prisma.teacher.create({
      data: {
        titlename,
        firstname,
        lastname,
      },
    });
    res.status(201).json(teacher);
  } catch (error) {
    console.error('Error creating teacher:', error);
    if (error.code === 'P2002') { 
      return res.status(400).json({ message: 'Duplicate entry' });
    }
    res.status(500).json({ error: error.message });
  }
};
exports.getTeachers = async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.status(200).json(teachers);
  } catch (error) {
    console.error('Error fetching teachers:', error);
    res.status(500).json({ error: error.message });
  }
};
exports.getTeacherById = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await prisma.teacher.findUnique({
      where: { teacher_id: Number(teacher_id) },
    });
    if (teacher) {
      res.status(200).json(teacher);
    } else {
      res.status(404).json({ message: 'Teacher not found' });
    }
  } catch (error) {
    console.error('Error fetching teacher:', error);
    if (isNaN(teacher_id)) { 
      return res.status(400).json({ message: 'Invalid teacher_id' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const { titlename, firstname, lastname } = req.body;
    const teacher = await prisma.teacher.update({
      where: { teacher_id: Number(teacher_id) },
      data: {
        titlename,
        firstname,
        lastname,
      },
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error updating teacher:', error);
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
exports.deleteTeacher = async (req, res) => {
  try {
    const { teacher_id } = req.params;
    const teacher = await prisma.teacher.delete({
      where: { teacher_id: Number(teacher_id) },
    });
    res.status(200).json(teacher);
  } catch (error) {
    console.error('Error deleting teacher:', error);
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Teacher not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
