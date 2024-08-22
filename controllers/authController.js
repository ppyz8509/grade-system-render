const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();

// โหลดตัวแปรสภาพแวดล้อม
require('dotenv').config();

const tables = [
  { model: 'admin', idField: 'admin_id', passwordField: 'password' },
  { model: 'course_in', idField: 'courseinstructor_id', passwordField: 'password' },
  { model: 'student', idField: 'student_id', passwordField: 'password' }
];

const findUser = async (model, username) => {
  return await prisma[model].findUnique({
    where: { username }
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    for (const table of tables) {
      let user = await findUser(table.model, username);
      if (user && user[table.passwordField] === password) {
        const token = jwt.sign(
          {
            id: user[table.idField],
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname
          },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        const { [table.passwordField]: _, ...userData } = user;
        return res.status(200).json({ message: 'Login successful', token });
      }
    }

    return res.status(404).json({ message: 'User not found' });

  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
};
