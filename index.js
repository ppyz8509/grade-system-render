
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const connectDb = require('./models/prisma');
const port = process.env.PORT || 5000;
const authRouter = require("./routers/authRouter");
const course_in_Router = require("./routers/course_in_Router");
const majorRouter = require("./routers/majorRouter");
const adminRouter = require("./routers/adminRouter");
const studentRouter = require('./routers/studentRouter');
const teacherRouter = require('./routers/teacherRouter');
const registerRouter = require('./routers/registerRouter');
const studentplanRouter = require('./routers/studentplanRouter');
const superadminRouter = require('./routers/superadminRouter');
const advisor = require('./routers/advisorRouter');
const section = require('./routers/sectionRouter')




const app = express();


// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(express.json());
app.get("/", (req, res) => {
    res.send("connected to backend");    
});


// Combine Routers
app.use("/api", authRouter);
app.use("/api", majorRouter);
app.use("/api", course_in_Router);
app.use("/api", adminRouter);
app.use("/api", superadminRouter);
app.use('/api', studentRouter);
app.use('/api', teacherRouter);
app.use('/api', registerRouter);
app.use('/api', studentplanRouter);
app.use('/api', advisor);
app.use('/api', section);



app.listen (port,async () => {
    await connectDb();
    console.log(`Server is running on port ${port}`);
});
