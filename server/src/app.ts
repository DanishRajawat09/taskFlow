import express from "express";
import cors from "cors"
import { CORS_ORIGIN } from "./config/env.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(express.json({limit: "16kb"}));
app.use(cors({origin: CORS_ORIGIN}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(morgan("dev"));





export default app