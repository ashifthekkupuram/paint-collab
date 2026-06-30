import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "./env.ts";
import authRoute from "./modules/auth/auth.routes.ts";

import { errorHandler } from "./middlewares/errorHandler.ts";

const app = express();

// App Configuration
app.use(cors({ origin: env.ALLOWED_ORIGINS.split(" "), credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health Check Endpoint
app.get("/healthy", (_, res) => {
  
  res.json({ message: "Paint Collab is Healthy!" });
});

// API Endpoints
app.use("/api/auth", authRoute);

// Error Handler
app.use(errorHandler);

export default app;

export { app };
