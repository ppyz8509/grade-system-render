const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).json({ message: "Authorization header is missing" });
            }
            const token = req.headers.authorization.split(" ")[1];
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized Access" });
                }
                
                let user;
                switch (decoded.role) {
                    case 'ADMIN':
                    case 'ADVISOR':
                    case 'STUDENT':
                    case 'COURSE_INSTRUCTOR':
                        user = await prisma.user.findUnique({ where: { id: decoded.id } });
                        break;
                    default:
                        return res.status(401).json({ message: "Invalid role" });
                         // ตรวจสอบบทบาทของผู้ใช้ที่ถอดรหัสจาก token
                         // ถ้าบทบาทเป็นหนึ่งใน 'ADMIN', 'ADVISOR', 'STUDENT', 'COURSE_INSTRUCTOR'
                         // จะค้นหาผู้ใช้ในฐานข้อมูลโดยใช้ id ที่ถอดรหัสมาได้
                         // ถ้าบทบาทไม่ตรงกับที่ระบุ ส่งสถานะ 401 และข้อความข้อผิดพลาด "Invalid role"
                }
                 
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
  
                if (!user.role || !roles.includes(user.role)) {
                    return res.status(403).json({ message: "Forbidden" });
                }
                
                req.user = user; // แทรกผู้ใช้ลงใน req เพื่อใช้ในฟังก์ชันถัดไป
                next(); // อนุญาตให้ไปยังฟังก์ชันถัดไป
            });
        } catch (error) {
            console.error("Error checking user role:", error.message);
            res.status(500).json({ message: "Error checking user role" });
        }
    };
  };
  
  module.exports = checkRole;
