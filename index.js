// 

const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api", authRouter);
app.use("/api", userRouter);


app.get("/",(req , res )=>{
  res.send("test")
})
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
