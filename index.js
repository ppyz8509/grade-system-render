const express = require("express");
const dotenv = require("dotenv");
const prismaClient = require("./db/db");

dotenv.config();

const app = express();

app.get("/", async (req, res) => {
  const resp = await prismaClient.user.create({
    data: { email: "test@gmail.com" },
  });
  res.send(resp);
});

app.listen(3000, () => {
  console.log("connected 3000");
});
