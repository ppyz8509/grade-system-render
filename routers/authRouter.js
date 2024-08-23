require('dotenv').config(); 
const express = require('express');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/authController'); 
const JWT_SECRET = process.env.JWT_SECRET; 

const router = express.Router(); // สร้าง router ใหม่จาก express

router.post('/login', login);

// Route สำหรับถอดรหัส token
router.get('/decode-token', async (req, res) => {
    try {
        // ดึง token จาก header Authorization
        const token = req.headers.authorization.split(" ")[1];

        // ถอดรหัส token โดยใช้ JWT_SECRET
        const decoded = jwt.verify(token, JWT_SECRET);

        // หากไม่สามารถถอดรหัสได้
        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        // ส่งข้อมูลที่ถอดรหัสแล้วกลับไป
        res.json({ decoded });
    } catch (error) {
        console.error("Error decoding token:", error.message); 
        res.status(500).json({ message: "Internal server error" }); 
    }
});

module.exports = router; 
