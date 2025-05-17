import express, { Router } from "express";
import cors from "cors";
import dotenv from "dotenv";
import type { Request, Response } from "express";
dotenv.config();

import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
import userRoute from "./routes/user.route.js";
import linkRoute from "./routes/link.route.js";
import dashboardRoute from "./routes/dashboard.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/link", linkRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "✅",
  });
});

// routes declaration
// When we write exact name of the function then the function is not exported using default
// when we export using deault we can name the function anything

export { app };
