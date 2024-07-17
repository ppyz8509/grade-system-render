const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const checkUsername = () => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.decode(token);

            if (!decoded) {
                return res.status(400).json({ message: "Invalid token" });
            }

            const user = await prisma.user.findUnique({
                where: { username: decoded.username }
            });

            if (!user) {
                return res.status(403).json({ message: "Access denied" });
            }

            next();
        } catch (error) {
            console.error("Error checking username:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    };
};

module.exports = checkUsername;
