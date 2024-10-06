
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // Attach user info to request object
    next();
  });
};

// Middleware to check if user is admin
const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Access forbidden: Admins only' });
  }
  next();
};

// Middleware to check if user is admin
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
