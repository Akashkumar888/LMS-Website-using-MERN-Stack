import express from "express";
import { requireAuth } from "@clerk/express";
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator,
} from "../controllers/educator.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { authEducator } from "../middlewares/authEducator.middleware.js";

const educatorRouter = express.Router();

educatorRouter.patch(
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

educatorRouter.get(
  "/courses",
  requireAuth(),
  authEducator,
  getEducatorCourses
);

educatorRouter.get(
  "/dashboard",
  requireAuth(),
  authEducator,
  educatorDashboardData
);

educatorRouter.get(
  "/enrolled-students",
  requireAuth(),
  authEducator,
  getEnrolledStudentsData
);

export default educatorRouter;
