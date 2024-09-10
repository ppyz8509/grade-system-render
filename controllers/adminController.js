const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an Admin
exports.createAdmin = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email, academic_id } = req.body;

    if (!username || !password || !firstname || !lastname || !academic_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (phone.length > 10) {
      return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
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
        academic_id
      },
    });
    res.status(201).json(admin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany({
      include:{
        academic:{
          select:{
            academic_name: true
          }
        }
      }
    });
    if (admins.length === 0) {
      return res.status(404).json({ message: 'Admin have no' });
    }
    res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getAdminById = async (req, res) => {
  try {
    const { admin_id } = req.params;


    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
      include:{
        academic:{
          select:{
            academic_name: true
          }
        }
      }
    });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.updateAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { username, firstname, lastname, phone, email, academic_id} = req.body;

    // isNaN "is Not-a-Number" ถ้าได้ตัวที่ไม่สามารถเเปลงเป็นตัวเลขได้จะคืนเป็น true ถ้าได้จะคืน false
    if (isNaN(admin_id)) { 
      return res.status(400).json({ message: 'ID is not number' });
    }
    if (phone.length > 10) {
      return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
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
        academic_id
      },
    });

    res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'ID is not number' });
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
    return res.status(500).json({ error: error.message });
  }
};