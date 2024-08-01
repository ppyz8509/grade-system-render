const prisma = require("../models/prisma");
const bcrypt = require("bcryptjs");

exports.createTeacher = async (req, res) => {

    console.log("Request Body:", req.body);
  
    const { 
      T_firstname,
      T_lastname,
      T_username,
      T_password,
      T_phone,
      T_email,
     } = req.body;
    
    
  
    const existingTeacher = await prisma.teacher.findFirst({
      where: { T_firstname },
    })
  
    if (existingTeacher) {

        const checkLastName = await prisma.teacher.findFirst({
            where: { T_lastname },
          })
          if (checkLastName) {
             return res.status(400).json({message: "Teacher already!!!!"})
          }
     
      
    }
  
    try {
    
      const hashedPassword = await bcrypt.hash(T_password, 10);
  
      const newTeacher = await prisma.teacher.create({
        data: 
        {
          T_firstname: T_firstname,
          T_lastname: T_lastname,
          T_username: T_username,
          T_password: hashedPassword,
          T_phone: T_phone,
          T_email: T_email,
        },
      });
  
      return res.status(201).json(newTeacher);
    } catch (error) {
      console.error("Error creating Teacher:", error);
      res.status(400).json({ error: error.message });
    }
};

exports.getAllTeachers = async (req,res) => {
    try {
        const teachers = await prisma.teacher.findMany({
            where: {role: 'TEACHER'}
        });
        res.status(200).json(teachers)
    } catch (error) {
        console.error("Error fetching teacher:", error.message);
        res.status(400).json({ error: error.message });
    }
}

exports.getTeacherById = async (req,res) => {

    console.log("Request params:", req.params);
      const { T_id } = req.params
      try {
          const teacher = await prisma.teacher.findUnique({
              where: {T_id: parseInt(T_id)}
              
          });
  
          if (!teacher) {
  
            res.status(404).json({ message: `Id ${T_id} not found`})
            return;
          }
  
          if ( teacher.role != 'TEACHER') {
            
            return res.status(404).json({ message: `ID ${T_id} are not Student!!!!` });
          } 
          
          
          res.status(200).json(teacher)
          
      } catch (error) {
          console.error("Error fetching teacher:", error.message);
          res.status(400).json({ error: error.message });
      }
}

exports.updateTeacher = async (req, res) => {
  const { T_id } = req.params;
  const {T_firstname, T_lastname,T_password,T_phone,T_email} = req.body

  try {
    const existingTeacher = await prisma.teacher.findUnique({
        where: {T_id: parseInt(T_id)}
    })
    if (!existingTeacher) {
      return res.status(404).json({ message: `Teacher with ID ${T_id} not found` });
    }


    if ( existingTeacher.role != 'TEACHER') {
      return res.status(404).json({ message: `ID ${T_id} are not Teacher!!!!` });
    }

    const updateTeacher = await prisma.teacher.update({
      where: {T_id: parseInt(T_id)},
      data: {
        T_firstname: T_firstname,
        T_lastname: T_lastname,
        T_password: T_password,
        T_phone: T_phone,
        T_email: T_email,


      }
    })

      res.status(200).json({message: `update Success!!!!`, updateTeacher})
  } catch (error) {
    console.error("Error updating Teacher:", error.message);
    res.status(400).json({ error: error.message });
  }
};


exports.deleteTeacher = async (req, res) => {
    console.log("Request params:", req.params);
    const { T_id } = req.params;
  
    try {
      // Check if the student with the given ID and username exists
      const existingTeacher = await prisma.teacher.findFirst({
        where: { T_id: parseInt(T_id)},
      });
  
      if (!existingTeacher) {
        return res.status(404).json({ error: `Teacher with ID ${T_id} not found` });
      }
  
      // Delete the student
      await prisma.teacher.delete({
        where: { T_id: parseInt(T_id)},
        
      });
  
      return res.status(200).json({ message: `Teacher with ID ${T_id} has been deleted successfully` });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Unable to delete teacher', details: error.message });
    }
}