const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    return null;
  }
  
};
exports.createAdvisor = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!username || !password || !firstname || !lastname || !sec_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }
    const existingAdvisor = await prisma.advisor.findUnique({ where: { username } });
    if (existingAdvisor) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const user = getUserFromToken(token);
    console.log(user);

    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }


    const advisor = await prisma.advisor.create({
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
        sec_id,
        academic_id: user.academic.academic_id,
      },
    });
    return res.status(201).json(advisor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Read all Advisors
exports.getAdvisors = async (req, res) => {
  try {
    const advisors = await prisma.advisor.findMany();
    if (advisors.length === 0) {
      return res.status(404).json({ message: 'Admin have no' });
    }
    return res.status(200).json(advisors);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getAdvisorById = async (req, res) => {
  try {
    const { advisor_id } = req.params;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const advisor = await prisma.advisor.findUnique({
      where: { advisor_id: Number(advisor_id) },
    });

    if (!advisor) {
      return res.status(404).json({ message: 'Advisor not found' });
    } 
    return res.status(200).json(advisor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.updateAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }
    if (phone ) {
      if (phone.length > 10) {
        return res.status(403).json({ message: 'Phone Do not exceed 10 characters.' }); 
      }
    }
    const AdvisorInExists = await prisma.advisor.findUnique({
      where: { advisor_id: Number(advisor_id) },
    });

    if (!AdvisorInExists) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    const advisor = await prisma.advisor.update({
      where: { advisor_id: Number(advisor_id) },
      data: {
        username,
        password,
        firstname,
        lastname,
        phone,
        email,
        sec_id,
      },
    });

    return res.status(200).json(advisor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.deleteAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'ID is not number' });
    }

    const AdvisorInExists = await prisma.advisor.findUnique({
      where: { advisor_id: Number(advisor_id) },
    });

    if (!AdvisorInExists) {
      return res.status(404).json({ message: 'Advisor not found' });
    }

    const advisor = await prisma.advisor.delete({
      where: { advisor_id: Number(advisor_id) },
    });

    return res.status(200).json(advisor);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
