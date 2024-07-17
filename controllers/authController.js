const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../models/prisma");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { studentInfo: { include: { studentPlan: true } } } // ดึงข้อมูล StudentInfo และ StudentPlan
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }


    const payload = {
      id: user.id,
      role: user.role,
      name: user.name,
      username: user.username,
    };

    if (user.role === 'STUDENT' && user.studentInfo) {
      payload.studentInfo = {
        id: user.studentInfo.id,
        studentIdcard: user.studentInfo.studentIdcard,
        year: user.studentInfo.year,
        room: user.studentInfo.room,
        studentPlan: user.studentInfo.studentPlan ? {
          id: user.studentInfo.studentPlan.id,
          studentPlanName: user.studentInfo.studentPlan.studentPlanName,
          studentPlanYear: user.studentInfo.studentPlan.studentPlanYear,
          courseId: user.studentInfo.studentPlan.courseId
        } : null
      };
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
