const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const advisorRouter = require("./routers/advisorRouter");
const course_in_Router = require("./routers/course_in_Router");
const majorRouter = require("./routers/majorRouter");


dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());

// Combine Routers 
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", advisorRouter);
app.use("/api", majorRouter);
app.use("/api", course_in_Router);

app.get("/", (req, res) => {
    res.send("test6442859030");
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
