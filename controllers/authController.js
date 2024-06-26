// controllers/authController.js

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");

exports.login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    let user;

    // Choose the database to search based on the user role
    switch (role) {
      case 'ADMIN':
        user = await prisma.admin.findUnique({ where: { username } });
        break;
      case 'ADVISOR':
        user = await prisma.advisor.findUnique({ where: { username } });
        break;
      case 'COURSE_INSTRUCTOR':
        user = await prisma.courseInstructor.findUnique({ where: { username } });
        break;
      default:
        return res.status(401).json({ message: "Invalid role" });
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Create token using user id and role
    const token = jwt.sign({ id: user.id, role: role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
