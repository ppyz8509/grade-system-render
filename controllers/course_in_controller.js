const prisma = require("../models/prisma")

exports.createClassroom = async (req,res) =>{
    const {roomname} = req.body

    try {

    const newClassroom = await prisma.classroom.create(
    {
        data: {
            roomname: roomname
        }
    })
    res.status(200).json(newClassroom)
    } catch (error) {
    res.status(400).json({error: error.message});
    }

}

exports.getAllRoom = async (req, res) => {
    const Rooms = await prisma.classroom.findMany([

    ])
    res.status(200).json(Rooms)
}