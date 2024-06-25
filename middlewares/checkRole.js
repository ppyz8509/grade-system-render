// middlewares/checkRole.js

const jwt = require('jsonwebtoken');

const checkRole = (roles) => {
  return (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); // เพิ่มการล็อกนี้เพื่อดูข้อมูล token ที่ถอดรหัส
      if (roles.includes(decoded.role)) {
        req.user = decoded;
        next();
      } else {
        res.status(403).send('Access denied');
      }
    } catch (error) {
      console.error('Invalid token:', error.message); // เพิ่มการล็อกนี้เพื่อดูข้อผิดพลาด
      res.status(401).send('Invalid token');
    }
  };
};

module.exports = checkRole;
