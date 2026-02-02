
import express from 'express'
import { requireAuth } from "@clerk/express";
import { getAllCourse, getCourseId } from '../controllers/course.controller.js';
const courseRouter=express.Router();

courseRouter.get('/all',requireAuth(),getAllCourse);
courseRouter.get('/:id',requireAuth() ,getCourseId);

export default courseRouter;