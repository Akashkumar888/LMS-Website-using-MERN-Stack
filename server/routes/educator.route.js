import express from "express";
import { requireAuth } from "@clerk/express";
import { addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/educator.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authEducator } from "../middlewares/authEducator.middleware.js";

const educatorRouter = express.Router();

// Add educator role (protected + REST correct)
educatorRouter.post(
  "/update-role",
  requireAuth(),
  updateRoleToEducator
);
educatorRouter.post(
  "/add-course",
  requireAuth(),
  authEducator,
  upload.single("image"),
  addCourse
);
educatorRouter.get('/courses',authEducator,getEducatorCourses);
educatorRouter.get('/dashboard',authEducator,educatorDashboardData);
educatorRouter.get('/enrolled-students',authEducator,getEnrolledStudentsData);


export default educatorRouter;
