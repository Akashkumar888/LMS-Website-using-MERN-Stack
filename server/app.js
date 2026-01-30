import express from "express";
import cors from "cors";
import webhookRouter from "./routes/webhook.routes.js";
import educatorRouter from "./routes/educator.route.js";
import {clerkMiddleware} from '@clerk/express'
import courseRouter from "./routes/course.route.js";

const app = express();

// Middleware
app.use(cors());
app.use(clerkMiddleware());


// IMPORTANT: Do NOT use express.json() before webhooks
app.use("/webhooks", webhookRouter);

// Normal APIs after this can use JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("API Working.");
});
// rest api rule follow
app.use('/api/educator',educatorRouter);
app.use('/api/course',courseRouter);


export default app;
