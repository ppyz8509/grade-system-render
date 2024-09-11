const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an SuperAdmin
exports.createSuperAdmin = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // ตรวจสอบว่ามี superadmin อยู่แล้วหรือไม่
    const existingSuperAdmin = await prisma.superadmin.findFirst();
    if (existingSuperAdmin) {
      return res.status(409).json({ message: 'SuperAdmin already exists. Only one SuperAdmin is allowed.' });
    }

    // สร้าง superadmin ใหม่ถ้ายังไม่มี
    const superadmin = await prisma.superadmin.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      },
    });

    res.status(201).json(superadmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getSuperAdmins = async (req, res) => {
  try {
    const superadmins = await prisma.superadmin.findMany();

    if (!superadmins || superadmins.length === 0) {
      return res.status(404).json({ message: 'No SuperAdmins found' });
    }

    res.status(200).json(superadmins);
  } catch (error) {
    console.error("Error getting superadmins:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getSuperAdminById = async (req, res) => {
  try {
    const { admin_id } = req.params;
    
    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    const superadmin = await prisma.superadmin.findUnique({
      where: { superadmin_id: parseInt(admin_id) },
    });

    if (!superadmin) {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }

    res.status(200).json(superadmin);
  } catch (error) {
    console.error("Error getting SuperAdmin by ID:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateSuperAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;
    const { username, password, firstname, lastname, phone, email } = req.body;

    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    if (!username || !password || !firstname || !lastname) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const superadmin = await prisma.superadmin.update({
      where: { superadmin_id: parseInt(admin_id) },
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
      },
    });

    res.status(200).json(superadmin);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }
    console.error("Error updating SuperAdmin:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.deleteSuperAdmin = async (req, res) => {
  try {
    const { admin_id } = req.params;

    if (isNaN(admin_id)) {
      return res.status(400).json({ message: 'Invalid SuperAdmin ID' });
    }

    const superadmin = await prisma.superadmin.delete({
      where: { superadmin_id: parseInt(admin_id) },
    });

    res.status(200).json({ message: 'SuperAdmin deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'SuperAdmin not found' });
    }
    console.error("Error deleting SuperAdmin:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
