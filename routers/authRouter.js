const express = require("express");
const jwt = require("jsonwebtoken");
const { login } = require("../controllers/authController");
const checkRole = require("../middlewares/checkRole");


const router = express.Router();
router.post("/login", login);


router.get('/decode-token', checkRole(['ADMIN', 'ADVISOR', 'STUDENT', 'COURSE_INSTRUCTOR']), async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // แยก JWT token จากส่วนหัว Authorization ของคำขอ

        const decoded = jwt.decode(token);
        // ถอดรหัส token ที่แยกมาโดยใช้เมธอด jwt.decode


        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
            // ถ้าถอดรหัส token แล้วได้ค่า null หรือ undefined จะส่งคำตอบ 400 
        }

        res.json({ decoded });
        // ส่ง payload ที่ถอดรหัสแล้วกลับไปเป็นคำตอบในรูปแบบ JSONasdasd
    } catch (error) {
        console.error("Error decoding token:", error.message);
        res.status(500).json({ message: "Internal server error" });
        // ถ้าเกิดข้อผิดพลาดใด ๆ ระหว่างกระบวนการนี้ จะบันทึกข้อผิดพลาดและส่งคำตอบ 500
    }
});

module.exports = router;
