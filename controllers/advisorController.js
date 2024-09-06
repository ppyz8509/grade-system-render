const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.createAdvisor = async (req, res) => {
  try {
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;
    
    if (!username || !password || !firstname || !lastname || !sec_id) {
      return res.status(400).json({ message: 'Missing required fields' });
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
      },
    });
    res.status(201).json(advisor);
  } catch (error) {
    console.error('Error creating advisor:', error);
    res.status(500).json({ error: error.message });
  }
};

// Read all Advisors
exports.getAdvisors = async (req, res) => {
  try {
    const advisors = await prisma.advisor.findMany();
    res.status(200).json(advisors);
  } catch (error) {
    console.error('Error fetching advisors:', error); 
    res.status(500).json({ error: error.message });
  }
};


exports.getAdvisorById = async (req, res) => {
  try {
    const { advisor_id } = req.params;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'Invalid advisor_id' });
    }

    const advisor = await prisma.advisor.findUnique({
      where: { advisor_id: Number(advisor_id) },
    });

    if (advisor) {
      res.status(200).json(advisor);
    } else {
      res.status(404).json({ message: 'Advisor not found' });
    }
  } catch (error) {
    console.error('Error fetching advisor by ID:', error); 
    res.status(500).json({ error: error.message });
  }
};

exports.updateAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;
    const { username, password, firstname, lastname, phone, email, sec_id } = req.body;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'Invalid advisor_id' });
    }

    if (!username && !password && !firstname && !lastname && !sec_id) {
      return res.status(400).json({ message: 'No fields to update' });
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

    res.status(200).json(advisor);
  } catch (error) {
    console.error('Error updating advisor:', error); 
    //P2025 เป็นรหัสข้อผิดพลาดเฉพาะของ Prisma ซึ่งหมายถึง "Record to update not found" หรือ "ไม่พบเรคคอร์ดที่ต้องการอัปเดต"
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Advisor not found' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAdvisor = async (req, res) => {
  try {
    const { advisor_id } = req.params;

    if (isNaN(advisor_id)) {
      return res.status(400).json({ message: 'Invalid advisor_id' });
    }

    const advisor = await prisma.advisor.delete({
      where: { advisor_id: Number(advisor_id) },
    });

    res.status(200).json(advisor);
  } catch (error) {
    console.error('Error deleting advisor:', error);
    //P2025 เป็นรหัสข้อผิดพลาดเฉพาะของ Prisma ซึ่งหมายถึง "Record to update not found" หรือ "ไม่พบเรคคอร์ดที่ต้องการอัปเดต"
    if (error.code === 'P2025') { 
      return res.status(404).json({ message: 'Advisor not found' });
    }
    res.status(500).json({ error: error.message });
  }
};
