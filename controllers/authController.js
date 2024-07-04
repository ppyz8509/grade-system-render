const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role , name: user.name ,   }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};