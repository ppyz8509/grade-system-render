const prisma = require("../models/prisma")

exports.createClassroom = async (req,res) =>{
    const {roomname, teacher} = req.body

    const existingRoom = await prisma.classroom.findFirst({
        where: { roomname }
      })
      console.log(existingRoom);
      if (existingRoom) {
        return res.status(400).json({message: "Room already!!!!"})   
      }
      // const existingTeacher = await prisma.teacher.findMany({
      //   where: {role: 'TEACHER'}
      // })
      // console.log(existingTeacher);
      
      // if (!existingTeacher) {
      //   console.log("teacher",existingTeacher);
      //   return res.status(400).json({message: "no teacher in database !!!!"})   
      // }

    try {

    const newClassroom = await prisma.classroom.create(
    {   
        data: {
            roomname: roomname,
            
        }
    })
    res.status(200).json(newClassroom)
    } catch (error) {
    res.status(400).json({error: error.message});
    }

}

exports.getAllRoom = async (req, res) => {
    const Rooms = await prisma.classroom.findMany()

    if (Rooms.length === 0 ) {
        return res.status(200).json({message : "no room"})
    }

    res.status(200).json(Rooms)
}

exports.getStudentInRoom = async (req, res) => {
    const { roomname } = req.params

    const Rooms = await prisma.classroom.findMany({
        where:{ roomname: roomname},
        include: {
            students
        }
    })

    if (Rooms.length === 0 ) {
        return res.status(200).json({message : "no room"})
    }

    res.status(200).json(Rooms)
}

exports.createAdvisor = async (req,res) =>{
  const  {teacherId, roomName, teacherfirstName,teacherlastName} = req.body

  try {

    const newAdvisor  = await prisma.advisor.create({
      data:{
        teacherId:teacherId,
        roomName:roomName,
        teacherfirstName:teacherfirstName,
        teacherlastName:teacherlastName,
      }
    })
    res.status(200).json(newAdvisor)
  } catch (error) {
    res.status(400).json({error: error.message});
  }

}

//เหลือดักว่าให้เช็คนักศึกษาว่ามีอยู่ในห้องเรียนไหม ก่อนที่จะลบ
exports.deleteRoom = async (req, res) => {
    console.log("Request params:", req.params);
    const { roomname } = req.params;
    const convertedRoom = roomname.replace(/\-/g,"/")
  
    try {
      // Check if the student with the given ID and username exists
      const existingRoom = await prisma.classroom.findFirst({
        where: { roomname: convertedRoom},
      });
  
      if (!existingRoom) {
        return res.status(404).json({ error: `Room with ID ${convertedRoom} not found` });
      }


  
      // Delete the student
      await prisma.classroom.delete({
        where: { roomname: convertedRoom},
        
      });
  
      return res.status(200).json({ message: `Room with ID ${convertedRoom} has been deleted successfully` });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({ error: 'Unable to delete Room', details: error.message });
    }
}

exports.deleteAdvisor = async (req, res) => {
  const { Advisor_id } = req.params;

  try {
    // Check if the student with the given ID and username exists
    const existingAdvisor = await prisma.advisor.findFirst({
      where: { Advisor_id: parseInt(Advisor_id)},
    });

    if (!existingAdvisor) {
      return res.status(404).json({ error: `Advisor with ID ${Advisor_id} not found` });
    }



    // Delete the student
    await prisma.advisor.delete({
      where: { Advisor_id: parseInt(Advisor_id)},
      
    });

    return res.status(200).json({ message: `Advisor with ID ${Advisor_id} has been deleted successfully` });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ error: 'Unable to delete Advisor', details: error.message });
  }
}

