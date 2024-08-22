const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create an Advisor
exports.createAdvisor = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;
    const advisor = await prisma.advisor.create({
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
    res.status(201).json(advisor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read all Advisors
exports.getAdvisors = async (req, res) => {
  try {
    const advisors = await prisma.advisor.findMany();
    res.status(200).json(advisors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Read a Single Advisor
exports.getAdvisorById = async (req, res) => {
  try {
    const { advisor_id } = req.params;
    const advisor = await prisma.advisor.findUnique({
      where: { advisor_id: Number(advisor_id) },
    });
    if (advisor) {
      res.status(200).json(advisor);
    } else {
      res.status(404).json({ message: 'Advisor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an Advisor
exports.updateAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;
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
    res.status(200).json(advisor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an Advisor
exports.deleteAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;
    const advisor = await prisma.advisor.delete({
      where: { advisor_id: Number(advisor_id) },
    });
    res.status(200).json(advisor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
