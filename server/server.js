import "dotenv/config";// 🔥 FIRST LINE

import express from "express";
import cors from "cors";
import webhookRouter from "./routes/webhook.routes.js";
import educatorRouter from "./routes/educator.route.js";
import {clerkMiddleware} from '@clerk/express'
import courseRouter from "./routes/course.route.js";
import userRouter from "./routes/user.route.js";

import connectDB from "./configs/db.config.js";
import connectCloudinary from "./configs/cloudinary.config.js";

const PORT = process.env.PORT || 5000;
const app = express();

// Connect DB before starting server
await connectDB();
await connectCloudinary();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://lms-website-using-mern-stack.vercel.app"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);



// IMPORTANT: Do NOT use express.json() before webhooks
// 🔥 WEBHOOKS FIRST (NO AUTH, NO JSON)
// 🚨 WEBHOOKS FIRST (NO JSON, NO AUTH)
app.use("/webhooks", webhookRouter);

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


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
