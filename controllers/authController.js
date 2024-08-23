const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// โหลดตัวแปรสภาพแวดล้อมจากไฟล์ .env
require('dotenv').config();

// กำหนดข้อมูลของแต่ละตารางที่ใช้ในการตรวจสอบการเข้าสู่ระบบ
const tables = [
  { model: 'admin', idField: 'admin_id', passwordField: 'password' },
  { model: 'course_in', idField: 'courseinstructor_id', passwordField: 'password' },
  { model: 'advisor', idField: 'advisor_id', passwordField: 'password' },
  { model: 'student', idField: 'student_id', passwordField: 'password' }
];

// ฟังก์ชันค้นหาผู้ใช้ในตารางที่กำหนดโดยใช้ชื่อผู้ใช้
const findUser = async (model, username) => {
  return await prisma[model].findUnique({
    where: { username }
  });
};

// ฟังก์ชันการเข้าสู่ระบบ
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // ตรวจสอบผู้ใช้ในแต่ละตารางตามลำดับ
    for (const table of tables) {
      // ค้นหาผู้ใช้จากตารางที่กำหนด
      let user = await findUser(table.model, username);
      // ตรวจสอบรหัสผ่านของผู้ใช้
      if (user && user[table.passwordField] === password) {
        // กำหนดบทบาทของผู้ใช้ตามตารางที่พบ
        let role;
        if (table.model === 'admin') role = 'admin';
        else if (table.model === 'advisor') role = 'advisor';
        else if (table.model === 'course_in') role = 'course_in';
        else if (table.model === 'student') role = 'student';

        // สร้าง JWT พร้อมข้อมูลของผู้ใช้
        const token = jwt.sign(
          {
            id: user[table.idField],         // ID 
            username: user.username,         // ชื่อผู้ใช้
            firstname: user.firstname,       // ชื่อจริงของผู้ใช้
            lastname: user.lastname,         // นามสกุลของผู้ใช้
            role: role                       // บทบาทของผู้ใช้
          },
          process.env.JWT_SECRET,            // สำหรับการเข้ารหัส JWT
          { expiresIn: '1h' }                // เวลาในการหมดอายุของ token
        );

        // ลบข้อมูลรหัสผ่านออกจากข้อมูลผู้ใช้ก่อนส่งกลับ
        const { [table.passwordField]: _, ...userData } = user;
        return res.status(200).json({ message: 'Login successful', token });
      }
    }

    // ถ้าผู้ใช้ไม่พบในตารางใดๆ
    return res.status(404).json({ message: 'User not found' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};