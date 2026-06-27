import express from "express";
import cors from "cors";

import { env } from "./env.ts";

const app = express();

// App Configuration
app.use(cors({ origin: env.ALLOWED_ORIGINS.split(" ") }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/healthy", (_, res) => {
  res.json({ message: "Paint Collab is Healthy!" });
});

export default app;

export { app };
