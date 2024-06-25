///


// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).send("Invalid email or password");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send("Invalid email or password");
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(400).json({ error: error.message });
  }
};
