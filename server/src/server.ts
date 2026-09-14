import express from "express"
import cors from "cors"
import { CORS_ORIGIN, PORT } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";
const app = express();

app.use(express.json());
app.use(cors({origin: CORS_ORIGIN}));


connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
)
