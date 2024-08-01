const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");



exports.createStudent = async (req, res) => {

  console.log("Request Body:", req.body);

  const { 
    S_id,
    S_firstname,
    S_lastname,
    S_password,
    S_phone,
    S_email,
    room,
   } = req.body;
  
  

  const exitingclassroom = await prisma.classroom.findMany()

  if (!exitingclassroom) {
    return res.status(400).json({message: "Room exting"})
    
  }
  console.log(exitingclassroom);

  const existingStudentId = await prisma.student.findFirst({
    where: { S_id },
  })

  if (existingStudentId) {
    return res.status(400).json({message: "Student Id already!!!!"})
    
  }



  const roomMatch = exitingclassroom.every(exitingRoom => exitingRoom.roomname !== room);
  if (roomMatch) {
     return res.status(400).json({ message: "room not match !!!!" });
  }
  

  try {
  
    const hashedPassword = await bcrypt.hash(S_password, 10);

    const newStudent = await prisma.student.create({
      data: 
      {
        S_id: S_id,
        S_firstname: S_firstname,
        S_lastname: S_lastname,
        S_password: hashedPassword,
        S_phone: S_phone,
        S_email: S_email,
        room: room,
      },
    });

    return res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error creating Student:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.getAllStudents = async (req,res) => {
    try {
        const student = await prisma.student.findMany({
            where: {role: 'STUDENT'}
        });
        res.status(200).json(student)
    } catch (error) {
        console.error("Error fetching student:", error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.getStudentById = async (req,res) => {

  console.log("Request params:", req.params);
    const { S_id } = req.params
    try {
        const student = await prisma.student.findUnique({
            where: {S_id: S_id}
            
        });
        console.log(student);

        if (!student) {

          res.status(404).json({ message: `Id ${S_id} not found`})
          return;
        }

        if ( student.role != 'STUDENT') {
          
          return res.status(404).json({ message: `ID ${S_id} are not Student!!!!` });
        } 
        
        
        res.status(200).json(student)
        
    } catch (error) {
        console.error("Error fetching student:", error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.getStudentByRoom = async (req,res) => {
  const { room } = req.params
  const convertedRoom = room.replace(/\-/g,"/")
  try {
      const student = await prisma.student.findMany({
        where: { room: convertedRoom, } ,
      })
      if (student.length === 0) {
        res.status(404).json({ message: `Room ${convertedRoom} not found`});
        return;
      }
      res.status(200).json(student)
  } catch (error) {
      console.error("Error fetching student:", error.message);
      res.status(400).json({ error: error.message });
  }
}


exports.updateStudent = async (req, res) => {
  const { S_id } = req.params;
  const {S_firstname, S_lastname,S_password,S_phone,S_email,room} = req.body

  try {
    const existingUser = await prisma.student.findUnique({
      where: {S_id: S_id}
    })
    if (!existingUser) {
      return res.status(404).json({ message: `Student with ID ${S_id} not found` });
    }


    if ( existingUser.role != 'STUDENT') {
      return res.status(404).json({ message: `ID ${S_id} are not Student!!!!` });
    }
    console.log(existingUser);

    const updateStudent = await prisma.student.update({
      where: { S_id: (S_id) },
      data: {
        S_firstname: S_firstname,
        S_lastname: S_lastname,
        S_password: S_password,
        S_phone: S_phone,
        S_email: S_email,
        room: room


      }
    })

      res.status(200).json({message: `update Success!!!!`, updateStudent})
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.deleteStudent = async (req, res) => {
  console.log("Request params:", req.params);
  const { S_id } = req.params;

  try {
    // Check if the student with the given ID and username exists
    const existingStudent = await prisma.student.findFirst({
      where: { S_id: S_id},
    });

    if (!existingStudent) {
      return res.status(404).json({ error: `Student with ID ${S_id} not found` });
    }

    // Delete the student
    await prisma.student.delete({
      where: {S_id: S_id}
      
    });

    return res.status(200).json({ message: `Student with ID ${S_id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Unable to delete student', details: error.message });
  }
}