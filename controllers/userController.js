const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");




exports.createUser = async (req, res) => {
  const { name, username, password, role } = req.body; // รับค่า role จาก req.body

  try {
    // Check if a user with the same username already exists
    const existingUser = await prisma.user.findFirst({
      where: { username },
    });

    if (!name) {
      res.status(400).json({ message: "no name" });
      return;
    }
    if (!username) {
      res.status(400).json({ message: "no username" });
      return;
    }
    if (!password) {
      res.status(400).json({ message: "no password" });
      return;
    }
    if (existingUser) {
      res.status(400).send('There is a user who already has this username.');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role, 
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};


// getAllUser
exports.getallUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        studentInfo: {
          include: {
            studentPlan: true,
          },
        },
      },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(400).json({ error: error.message });
  }
};




// Get Roles 
exports.getRole = async (req, res) => {
  const { role } = req.params;

  try {
    const users = await prisma.user.findMany({
      where: {
        role: role.toUpperCase() // เปลี่ยนบทบาทให้เป็นตัวพิมพ์ใหญ่ทั้งหมด
      },
      include: {
        studentInfo: {
          include: {
            studentPlan: true,
          },
        },
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(400).json({ error: "Error fetching users by role" });
  }
};



// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : existingUser.password;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password: hashedPassword || existingUser.password,
      },
    });
    res.status(200).json({ message: `User with ID ${id} has been updated successfully`, user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ message: `User with ID ${id} not found` });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.status(200).json({ message: `User with ID ${id} has been deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(400).json({ error: error.message });
  }
};




// Create Course Instructor
exports.createCourseInstructor = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    // Check if course instructor with the same username already exists
    const existingCourseInstructor = await prisma.courseInstructor.findFirst({
      where: { username },
    });

    if (existingCourseInstructor) {
      return res.status(400).send('Course instructor with this username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new course instructor
    const newCourseInstructor = await prisma.courseInstructor.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: 'COURSE_INSTRUCTOR',
      },
    });

    res.status(201).json(newCourseInstructor);
  } catch (error) {
    console.error("Error creating course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Update CourseInstructor
exports.updateCourseInstructor = async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    const updatedInstructor = await prisma.courseInstructor.update({
      where: { id: parseInt(id) },
      data: {
        name,
        username,
        password: hashedPassword,
      },
    });

    res.status(200).json(updatedInstructor);
  } catch (error) {
    console.error("Error updating course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Delete CourseInstructor
exports.deleteCourseInstructor = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.courseInstructor.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting course instructor:", error.message);
    res.status(400).json({ error: error.message });
  }
};

// Get All CourseInstructors
exports.getAllCourseInstructors = async (req, res) => {
  try {
    const instructors = await prisma.courseInstructor.findMany({
      where: { role: 'COURSE_INSTRUCTOR' },
    });
    res.status(200).json(instructors);
  } catch (error) {
    console.error("Error fetching course instructors:", error.message);
    res.status(400).json({ error: error.message });
  }
};

