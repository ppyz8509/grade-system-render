
const { PrismaClient } = require('@prisma/client');

const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();


/// ยืนยันตัวตนโดยใช้ JWT token
const authenticateToken = (req, res, next) => {
  // ดึง token จาก header 'Authorization' และตัดคำว่า 'Bearer ' ออก
  const token = req.header('Authorization')?.replace('Bearer ', '');

  //  บ่มีtoken
  if (!token) return res.status(401).json({ message: 'Access denied' });

  // ตรวจสอบ token โดยใช้ jwt.verify
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // token ไม่ถูกต้องหรือหมดอายุ
    if (err) return res.status(403).json({ message: 'Invalid token' });
    
    //token ถูกต้อง ให้แนบข้อมูลผู้ใช้ไปกับ request object user 
    req.user = user;
    
    next();
  });
};

/// ตรวจสอบว่าเป็น superadmin หรือไม่
const isSuperAdmin = (req, res, next) => {
 /// ถ้า role ของผู้ใช้ไม่ใช่ 
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  
  next();
};

const isCourse_in = (req, res, next) => {
  if (req.user.role !== 'course_in') {
    return res.status(403).json({ message: 'Access forbidden: course_in only' });
  }
  
  next();
};

const isAdvisor = (req, res, next) => {
  if (req.user.role !== 'advisor') {
    return res.status(403).json({ message: 'Access forbidden: advisor only' });
  }
  
  next();
};

module.exports = { 
  authenticateToken, 
  isSuperAdmin,
  isAdmin,
  isCourse_in,
  isAdvisor
};
