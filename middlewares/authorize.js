const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
  // คืนค่า middleware ที่ตรวจสอบสิทธิ์การเข้าถึง
  return (req, res, next) => {
    // ตรวจสอบการมีอยู่ของ Bearer token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // หากไม่มี Bearer token
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // ดึง token จาก header
    const token = authHeader.split(' ')[1];

    try {
      // ตรวจสอบ ถอดรหัสJWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ตรวจสอบสิทธิ์การเข้าถึง (หากมีการกำหนดบทบาทที่ต้องการ)
      if (roles.length && !roles.includes(decoded.role)) {
        // หากบทบาทของผู้ใช้ไม่ตรงกับบทบาทที่อนุญาต
        return res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
      }

      // เก็บข้อมูลผู้ใช้ที่ถอดรหัสแล้วใน request object
      req.user = decoded;
      // เรียกใช้งาน middleware ถัดไป
      next();
    } catch (error) {
      // หาก token ไม่ถูกต้องหรือหมดอายุ
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authorize;
