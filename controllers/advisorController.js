const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");

exports.createStudent = async (req, res) => {
  const { name, username, password, year, room, studentIdcard} = req.body; // รับค่า role จาก req.body

  try {
    // Check if a user with the same username already exists
    const existingUser = await prisma.user.findFirst({
      where: { 
        username,
       },
    });
    const existingStudent = await prisma.studentInfo.findFirst({
      where: { 
        studentIdcard,
       },
    });
    if (!username) {
      res.status(400).json({message : "no username"})
      return;
    }

    if (!password) {
      res.status(400).json({message : "no password"})
      return;
    }
if (existingUser) {
   return res.status(400).send('User with this Student already exists');
} 
if (existingStudent) {
  return res.status(400).send('Student ID with this Student already exists');
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
        studentInfo: {
          create: {year , room, studentIdcard} 
        }
      }, include: {studentInfo: true}
    });


    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating Student:", error.message);
    res.status(400).json({ error: error.message });
  }
};

exports.getStudent = async (req,res) => {
    try {
        const student = await prisma.user.findMany({
            where: {role: 'STUDENT'}, 
            include: {studentInfo: true}
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
            where: {id: parseInt(id)},
            include: {studentInfo: true}
        });
        if (!student) {
          res.status(404),json({ message: `Id ${id} not found`})
          return;
        }
        res.status(200).json(student)
        
    } catch (error) {
        console.error("Error fetching student:", error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.getStudentByRoom = async (req,res) => {
  const { room } = req.params
  const convertedRoom = parseInt(room)
  try {
      const student = await prisma.user.findMany({
        where: {studentInfo: {room: convertedRoom} } ,
        include: {studentInfo: true}
      })
      if (student.length === 0) {
        res.status(404).json({ message: `Room ${room} not found`});
        return;
      }
      res.status(200).json(student)
  } catch (error) {
      console.error("Error fetching student:", error.message);
      res.status(400).json({ error: error.message });
  }
}

exports.getStudentByYear = async (req,res) => {
  const { year } = req.params
  const convertedYear = parseInt(year)
  try {
      const student = await prisma.user.findMany({
        where: {studentInfo: {year: convertedYear} } ,
        include: {studentInfo: true}
      })
      if (student.length === 0) {
        res.status(404).json({ message: `Year ${year} not found`});
        return;
      }
      res.status(200).json(student)
  } catch (error) {
      console.error("Error fetching student:", error.message);
      res.status(400).json({ error: error.message });
  }
}