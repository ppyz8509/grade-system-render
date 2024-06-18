const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

const connectDb = () => {
  try {
    prismaClient.$connect;
    console.log("connected db");
  } catch (error) {
    console.log(error);
  }
};

connectDb();

module.exports = prismaClient;
