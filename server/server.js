import "dotenv/config";// 🔥 FIRST LINE

import http from "http";
import app from "./app.js";
import connectDB from "./configs/db.config.js";
import connectCloudinary from "./configs/cloudinary.config.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
// Connect DB before starting server
await connectDB();
await connectCloudinary();

server.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
