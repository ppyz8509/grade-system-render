const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");


///check role and verifyToken


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
                  case 'COURSE_INSTRUCTOR':
                      user = await prisma.user.findUnique({ where: { id: decoded.id } });
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
          });
      } catch (error) {
          console.error("Error checking user role:", error.message);
          res.status(500).json({ message: "Error checking user role" });
      }
  };
};

module.exports = checkRole;