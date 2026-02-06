import { clerkClient } from "@clerk/express";
import courseModel from "../models/course.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.util.js";
import purchaseModel from "../models/purchase.model.js";

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // prevent duplicate role update
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role === "educator") {
      return res.json({
        success: true,
        message: "Already an educator",
      });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({
      success: true,
      message: "You can publish a course now",
    });
  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addCourse = async (req, res) => {
  try {
    const auth = req.auth();
    const educatorId = auth?.userId;

    const { courseData } = req.body;
    const image = req.file;

    if (!educatorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Course thumbnail is required",
      });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const uploadedImage = await uploadImageCloudinary(image);
    parsedCourseData.courseThumbnail = uploadedImage.secure_url;

    await courseModel.create(parsedCourseData);

    res.status(201).json({
      success: true,
      message: "Course added successfully",
    });
  } catch (error) {
    console.error("ADD COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEducatorCourses = async (req, res) => {
  try {
    const auth = req.auth();
    const educatorId = auth?.userId;

    const courses = await courseModel.find({ educator: educatorId });
    res.json({ success: true, courses });
  } catch (error) {
    console.error("FETCH COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const educatorDashboardData = async (req, res) => {
  try {
    const auth = req.auth();
    const educatorId = auth?.userId;

    const courses = await courseModel.find(
      { educator: educatorId },
      "_id courseTitle enrolledStudents"
    );

    const totalCourses = courses.length;
    const courseIds = courses.map(c => c._id);

    const purchases = await purchaseModel.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = purchases.reduce((sum, p) => sum + p.amount, 0);

    const enrolledStudentsData = courses.flatMap(course =>
      course.enrolledStudents.map(userId => ({
        userId,
        courseTitle: course.courseTitle,
      }))
    );

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getEnrolledStudentsData = async (req, res) => {
  try {
    const auth = req.auth();
    const educatorId = auth?.userId;

    const courses = await courseModel.find(
      { educator: educatorId },
      "_id courseTitle"
    );

    const courseMap = new Map(
      courses.map(c => [c._id.toString(), c.courseTitle])
    );

    const purchases = await purchaseModel.find({
      courseId: { $in: [...courseMap.keys()] },
      status: "completed",
    });

    const enrolledStudents = purchases.map(p => ({
      userId: p.userId,
      courseTitle: courseMap.get(p.courseId.toString()),
      purchasedAt: p.createdAt,
      amount: p.amount,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("ENROLLED STUDENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
