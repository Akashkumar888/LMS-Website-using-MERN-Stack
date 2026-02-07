import express from "express";
import { getAllCourse, getCourseId } from "../controllers/course.controller.js";

const courseRouter = express.Router();

// ✅ PUBLIC ROUTES
courseRouter.get("/all", getAllCourse);
courseRouter.get("/:id", getCourseId);

export default courseRouter;
