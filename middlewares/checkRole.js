// middlewares/checkRole.js

const prisma = require("../models/prisma");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // Ensure req.user is correctly defined

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("Error checking user role:", error.message);
      res.status(500).json({ message: "Internal server error" });
    }
  };
};

module.exports = checkRole;
