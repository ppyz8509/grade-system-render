const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ดึงข้อมูลผู้ใช้จาก JWT token
const getUserFromToken = (token) => {
  try {
    // ตรวจสอบและถอดรหัส JWT token โดยใช้คีย์ลับจากตัวแปรสภาพแวดล้อม (environment variables)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // ส่งค่าที่ถูกถอดรหัส ซึ่งเป็นข้อมูลของผู้ใช้กลับมา
    return decoded;
  } catch (err) {
    // หากการตรวจสอบ token ล้มเหลว จะส่งค่า null กลับมา
    return null;
  }
};

// ฟังก์ชันสำหรับสร้าง Section ใหม่
exports.createSection = async (req, res) => {
  try {
    const { sec_name } = req.body;

    // รับ JWT token จาก header 'Authorization' และลบ 'Bearer ' ออกจาก token
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // ตรวจสอบว่ามีการส่ง sec_name มาหรือไม่
    if (!sec_name) {
      return res.status(400).json({ message: 'ต้องระบุชื่อ Section' });
    }

    // ตรวจสอบว่า section ที่มีชื่อเดียวกันนี้มีอยู่ในฐานข้อมูลหรือไม่
    const existingSection = await prisma.section.findFirst({ where: { sec_name } });
    if (existingSection) {
      return res.status(409).json({ message: 'Section นี้มีอยู่แล้ว' });
    }

    const user = getUserFromToken(token);
    console.log(user);

    // สร้าง Section ใหม่ในฐานข้อมูลโดยใช้ Prisma
    const section = await prisma.section.create({
      data: {
        sec_name,  // ชื่อ Section
        // ใช้ academic_id จากข้อมูลผู้ใช้ที่ถอดรหัสออกมาเพื่อเชื่อมโยง Section กับข้อมูลทางการศึกษา
        academic_id: user.academic.academic_id,
      },
    });

    return res.status(201).json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getSections = async (req, res) => {
  try {
    const sections = await prisma.section.findMany();
    if (sections.length === 0) {
      return res.status(404).json({ message: 'Section have no' });
    }
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSectionById = async (req, res) => {
  try {
    const { sec_id } = req.params;
    
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    
    const section = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    
    if (!section) {
      return res.status(404).json({ message: 'section not found' });
    } 
   
    return res.status(200).json(section);

  } catch (error) {
    console.error('Error fetching section by ID:', error); 
    return res.status(500).json({ error: error.message });
  }
};

exports.updateSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const { sec_name } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check for valid input
    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    if (!sec_name) {
      return res.status(400).json({ message: 'Section name is required' });
    }

    // Get user from token
    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // Find the section by sec_id
    const existsSection = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    
    if (!existsSection) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Check if academic_id from token matches the section's academic_id
    if (existsSection.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }

    // Proceed to update the section if academic_id matches
    const section = await prisma.section.update({
      where: { sec_id: Number(sec_id) },
      data: {
        sec_name,
      },
    });

    return res.status(200).json(section);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sec_id } = req.params;
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (isNaN(sec_id)) {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    const existsSection = await prisma.section.findUnique({
      where: { sec_id: Number(sec_id) },
    });
    if (!existsSection) {
      return res.status(404).json({ message: 'Section not found' });
    }
    const user = getUserFromToken(token);
    if (!user || !user.academic) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (existsSection.academic_id !== user.academic.academic_id) {
      return res.status(403).json({ message: 'Permission denied: Academic ID mismatch' });
    }

    const section = await prisma.section.delete({
      where: { sec_id: Number(sec_id) },
    });
    return res.status(200).json(section);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
