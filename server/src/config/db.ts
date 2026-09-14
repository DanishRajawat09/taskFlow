import { DATABASE_URI} from "./env.js";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: DATABASE_URI,
});

const prisma = new PrismaClient({
  adapter,
});
const connectToDatabase = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }

}

export  {prisma , connectToDatabase};