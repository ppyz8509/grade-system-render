// middlewares/authenticate.js

const jwt = require("jsonwebtoken");
const prisma = require("../models/prisma");

const authenticate = async (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new Error();
    }

    req.user = user; // Add user to the request object
    next();
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = authenticate;
