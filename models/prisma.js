const { PrismaClient } = require("@prisma/client");

const prismaClient = new PrismaClient();

const connectDb = async () => {
  try {
    await prismaClient.$connect();
    console.log("connected to db");
  } catch (error) {
    console.log("Failed to connect to db:", error);
  }
};
connectDb();

module.exports = prismaClient;
