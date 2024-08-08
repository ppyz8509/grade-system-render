const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an Admin
exports.createAdmin = async (req, res) => {
  try {
    const { username,password, firstname, lastname, role, phone, email } = req.body;
    const admin = await prisma.admin.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        role,
        phone,
        email,
      },
    });
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read All Admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Admin
exports.getAdminById = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const admin = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
    });
    if (admin) {
      res.status(200).json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Admin
exports.updateAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { username, firstname, lastname, role, phone, email } = req.body;
    const admin = await prisma.admin.update({
      where: { admin_id: Number(admin_id) },
      data: {
        username,
        firstname,
        lastname,
        role,
        phone,
        email,
      },
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Admin
exports.deleteAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const admin = await prisma.admin.delete({
      where: { admin_id: Number(admin_id) },
    });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
