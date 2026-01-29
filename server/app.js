import express from "express";
import cors from "cors";
import webhookRouter from "./routes/webhook.routes.js";

const app = express();

// Middleware
app.use(cors());

// IMPORTANT: Do NOT use express.json() before webhooks
app.use("/webhooks", webhookRouter);

// Normal APIs after this can use JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("API Working.");
});

export default app;
