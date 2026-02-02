import express from "express";
import { requireAuth } from "@clerk/express";
import {
  getUserData,
  purchaseCourse,
  userEnrolledCourses,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// 🔐 ALL user routes must be protected
userRouter.get("/data", requireAuth(), getUserData);
userRouter.get("/enrolled-courses", requireAuth(), userEnrolledCourses);
userRouter.post("/purchase", requireAuth(), purchaseCourse);

export default userRouter;
