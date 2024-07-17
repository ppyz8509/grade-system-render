const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const courseRouter = require("./routers/courseRouter"); 
const advisorRouter = require("./routers/advisorRouter"); 

dotenv.config();

const app = express();
app.use(express.json());

//รวม Router
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", courseRouter); 
app.use("/api", advisorRouter); 


app.get("/", (req, res) => {
  res.send("test6442859030");
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
