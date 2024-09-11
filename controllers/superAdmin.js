const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an SuperAdmin
exports.createsuperAdmin = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email, academic_id } = req.body;

    if (!username || !password || !firstname || !lastname || !academic_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingSuperAdmin = await prisma.superadmin.findUnique({ where: { username } });
    if (existingSuperAdmin) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const superadmin = await prisma.superadmin.create({
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
    res.status(201).json(superadmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSuperAdmins = async (req, res) => {
  try {
    const superadmins = await prisma.superadmin.findMany({
      include:{
        academic:{
          select:{
            academic_name: true
          }
        }
      }
    });
    if (superadmins.length === 0) {
      return res.status(404).json({ message: 'SuperAdmin have no' });
    }
    res.status(200).json(superadmins);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getSuperAdminById = async (req, res) => {
  try {
    const { superadmin_id } = req.params;


    if (isNaN(superadmin_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const superadmin = await prisma.superadmin.findUnique({
      where: { superadmin_i: Number(superadmin_id) },
      include:{
        academic:{
          select:{
            academic_name: true
          }
        }
      }
    });

    if (!superadmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json(superadmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSuperAdmin = async (req, res) => {
  try {
    const { superadmin_id } = req.params;
    const { username, firstname, lastname, phone, email, academic_id} = req.body;


    if (isNaN(superadmin_id)) { 
      return res.status(400).json({ message: 'ID is not number' });
    }

    const superadminExists = await prisma.superadmin.findUnique({
      where: { admin_id: Number(superadmin_id) },
    });

    if (!superadminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const superadmin = await prisma.superadmin.update({
      where: { superadmin_id: Number(superadmin_id) },
      data: {
        username,
        firstname,
        lastname,
        phone,
        email,
        academic_id
      },
    });

    res.status(200).json(superadmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteSuperAdmin = async (req, res) => {
  try {
    const { superadmin_id } = req.params;

    if (isNaN(superadmin_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const superadminExists = await prisma.admin.findUnique({
      where: { admin_id: Number(admin_id) },
    });

    if (!superadminExists) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    const superadmin = await prisma.superadmin.delete({
      where: { superadmin_id: Number(superadmin_id) },
    });

    res.status(200).json(superadmin);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}; 