const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routers/authRouter");
const userRouter = require("./routers/userRouter");
const advisorRouter = require("./routers/advisorRouter"); 
const majorRouter = require("./routers/majorRouter");



dotenv.config();

const app = express();
app.use(express.json());

//รวม Router
app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", advisorRouter); 
app.use("/api", majorRouter);

app.get("/", (req, res) => {
  res.send("test6442859030");
});


app.listen(3000, () => {
  console.log("Server running on port 3000");
});
