const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.header("Authorization");
      if (!authHeader) {
        return res.status(401).json({ message: "Authorization header is missing" });
      }

      const token = authHeader.replace("Bearer ", "");
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      let user;
      switch (decoded.role) {
        case 'ADMIN':
          user = await prisma.admin.findUnique({ where: { id: decoded.id } });
          break;
        case 'ADVISOR':
          user = await prisma.advisor.findUnique({ where: { id: decoded.id } });
          break;
        case 'COURSE_INSTRUCTOR':
          user = await prisma.courseInstructor.findUnique({ where: { id: decoded.id } });
          break;
        default:
          return res.status(401).json({ message: "Invalid role" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user; // Set the user to req.user for future use
      next();
    } catch (error) {
      console.error("Error checking user role:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = checkRole;
