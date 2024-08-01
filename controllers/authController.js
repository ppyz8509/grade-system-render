const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 
const jwt = require('jsonwebtoken'); 
const bcrypt = require('bcryptjs'); 
const JWT_SECRET = process.env.JWT_SECRET;


exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // ค้นหาผู้ใช้
    let user = await prisma.student.findUnique({
      where: { S_id: username },
    }) || await prisma.admin.findFirst({
      where: { A_username: username },
    }) || await prisma.courseInstructor.findFirst({
      where: { C_username: username },
    }) || await prisma.teacher.findFirst({
      where: { T_username: username },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // ตรวจสอบรหัส
    const validPassword = await bcrypt.compare(
      password,
      user.S_password || user.A_password || user.C_password || user.T_password
    );

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // สร้างToken
    const token = jwt.sign(
      {
        userId: user.S_id || user.Admin_id || user.C_id || user.T_id,
        role: user.role,  
        firstname: user.S_firstname || user.A_firstname || user.C_firstname || user.T_firstname,
        lastname: user.S_lastname || user.A_lastname || user.C_lastname || user.T_lastname,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};
