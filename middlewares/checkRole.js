const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkRole = (role) => {
  return async (req, res, next) => {
    // ตรวจสอบการมีอยู่ของ token
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    const { id, username } = req.user;

    try {
      // ตรวจสอบผู้ใช้จาก token ว่ามี role ตามที่ต้องการ
      const user = await prisma.course_in.findUnique({
        where: { username },
      });

      if (user) {
        // ตรวจสอบว่า user มี role ที่ต้องการ
        if (role === 'course_in') {
          return next();
        }
      }

      return res.status(403).json({ message: 'Forbidden' });
    } catch (error) {
      return res.status(500).json({ message: 'Server error', error });
    }
  };
};

module.exports = checkRole;
