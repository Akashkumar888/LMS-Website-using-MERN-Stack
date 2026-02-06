import express from "express";
import cors from "cors";
import webhookRouter from "./routes/webhook.routes.js";
import educatorRouter from "./routes/educator.route.js";
import {clerkMiddleware} from '@clerk/express'
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";
import stripeRouter from "./routes/stripe.route.js";

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // ❌ NOT "*"
    credentials: true,               // ✅ REQUIRED for Clerk
  })
);


// IMPORTANT: Do NOT use express.json() before webhooks
// 🔥 WEBHOOKS FIRST (NO AUTH, NO JSON)
app.use("/webhooks", webhookRouter);
app.use("/stripe", stripeRouter);


// 🔐 AUTH AFTER WEBHOOKS
app.use(clerkMiddleware());

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
app.use('/api/user',userRouter);


export default app;
