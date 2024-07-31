const { Role } = require("@prisma/client");
const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");
const { json } = require("express");


exports.createStudent = async (req, res) => {

  console.log("Request Body:", req.body);

  const { 
    S_id,
    S_fristname,
    S_lastname,
    S_username,
    S_password,
    S_phone,
    S_email,
    room, 
    roomname
   } = req.body;
  
  

  const exitingclassroom = await prisma.classroom.findMany({
    where: { 
      classroom: [roomname]
      

     },
  })

  if (!exitingclassroom) {
    return res.status(400).json({message: "Room exting"})
    
  }
  console.log(roomname);

  const existingStudentId = await prisma.student.findFirst({
    where: { S_id },
  })

  if (existingStudentId) {
    return res.status(400).json({message: "Student Id already!!!!"})
    
  }
  const existingStudentUser = await prisma.student.findFirst({
    where: { S_username },
  })

  if (existingStudentUser) {
    return res.status(400).json({message: "Username already!!!!"})
    
  }





  try {
  
    const hashedPassword = await bcrypt.hash(S_password, 10);

    const newStudent = await prisma.student.create({
      data: 
      {
        S_id: S_id,
        S_fristname: S_fristname,
        S_lastname: S_lastname,
        S_username: S_username,
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

        if ( student.role != 'STUDENT') {
          return res.status(404).json({ message: `ID ${id} are not Student!!!!` });
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

exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const {name, studentIdcard,year,room} = req.body

  try {
    const existingUser = await prisma.user.findUnique({
      where: {id: parseInt(id)},
      include: {studentInfo: true}
    })
    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }


    if ( existingUser.role != 'STUDENT') {
      return res.status(404).json({ message: `ID ${id} are not Student!!!!` });
    }
    console.log(existingUser);




    const updateStudent = await prisma.user.update({
      where: { id: parseInt(id) },
      include: {studentInfo: true},
      data: {
        name,
        studentInfo:{
        update: {
          year, 
          room, 
          studentIdcard
        }
      } 
      }
    })

      res.status(200).json({message: `update Success!!!!`, updateStudent})
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.createStudentPlan = async (req, res) => {
  const {studentPlanName, studentPlanYear } = req.body
  try {

    const newStudentPlan = await prisma.studentPlan.create({
      data: {
        studentPlanName,
        studentPlanYear
      } 
    });
    res.status(201).json(newStudentPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
  
}

exports.updateStudentPlan = async (req, res) => {
  const { id } = req.params;
  const { category, group, course } = req.body
  console.log(category,group,course);
  try {
      const updateStudentPlan = await prisma.studentPlan.update({
        where: { id: parseInt(id)},
        include: {studentPlan: true},
        data: {
          categoryName: category.categoryName,
          groupName: group.groupName,
          courseName: course.courseName
  }
  
});

      res.status(201).json(updateStudentPlan)
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  console.log("Request params:", req.params);
  const { S_id, S_username } = req.params;

  try {
    // Check if the student with the given ID and username exists
    const existingStudent = await prisma.student.findFirst({
      where: { S_id: S_id, S_username: S_username },
    });

    if (!existingStudent) {
      return res.status(404).json({ error: `Student with ID ${S_id} not found` });
    }

    // Delete the student
    await prisma.student.delete({
      where: {
        S_id_S_username: {
          S_id: S_id,
          S_username: S_username
        }
      }
    });

    return res.status(200).json({ message: `Student with ID ${S_id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Unable to delete student', details: error.message });
  }
}