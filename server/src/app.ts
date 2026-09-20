import express from "express";
import cors from "cors"
import { CORS_ORIGIN } from "./config/env.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import routes from "./routes/index.js";
import globalErrorHandler from "./common/middlewares/globalErrorHandler.js";
import logger from "./common/middlewares/logger.js";
const app = express();

app.use(express.json({limit: "16kb"}));
app.use(cors({origin: CORS_ORIGIN}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));

// routers

app.use("/api/v1/auth", routes.auth);

// logger
app.use(logger)

// errorHandler
app.use(globalErrorHandler);

export default app