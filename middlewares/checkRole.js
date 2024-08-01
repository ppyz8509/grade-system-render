
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const JWT_SECRET = process.env.JWT_SECRET;

const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET);

            if (!decoded) {
                return res.status(401).json({ message: "Invalid token" });
            }

            // ตรวจสอบในโมเดล
            const user = await prisma.admin.findUnique({
                where: { Admin_id: decoded.userId }
            }) || await prisma.courseInstructor.findUnique({
                where: { C_id: decoded.userId }
            }) || await prisma.student.findUnique({
                where: { S_id: decoded.userId }
            }) || await prisma.teacher.findUnique({
                where: { T_id: decoded.userId }
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({ message: "Access denied" });
            }

            req.user = user;
            next();
        } catch (error) {
            console.error("Error in checkRole middleware:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = checkRole;
