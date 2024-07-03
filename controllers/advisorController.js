const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");

exports.createStudent = async (req, res) => {
  const { name, username, password, year, room, } = req.body; // รับค่า role จาก req.body

  try {
    // Check if a user with the same username already exists
    const existingStudent = await prisma.user.findFirst({
      where: { 
        username,
       },
    });

    if (existingStudent) {
      return res.status(400).send('User with this Student already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the specified role
    const newStudent = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: "STUDENT",
        year,
        room,
      },
    });

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getStudent = async (req,res) => {
    try {
        const student = await prisma.user.findMany({
            where: {role: 'STUDENT'}
        });
        res.status(200).json(student)
    } catch (error) {
        console.error("Error fetching student:", error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.getStudentById = async (req,res) => {
    const { id } = req.params
    try {
        const student = await prisma.user.findUnique({
            where: {id: parseInt(id)}
        });
        res.status(200).json(student)
    } catch (error) {
        console.error("Error fetching student:", error.message);
        res.status(400).json({ error: error.message });
    }
}