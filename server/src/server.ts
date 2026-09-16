import app from "./app.js";
import {  PORT } from "./config/env.js";
import { connectToDatabase } from "./config/db.js";


connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to the database:", error);
  process.exit(1);
}
)
