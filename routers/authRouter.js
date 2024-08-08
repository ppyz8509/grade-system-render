require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { login } = require('../controllers/authController');
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/login', login);

router.get('/decode-token', async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded) {
            return res.status(400).json({ message: "Invalid token" });
        }

        res.json({ decoded });
    } catch (error) {
        console.error("Error decoding token:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
