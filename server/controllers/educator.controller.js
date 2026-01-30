import { clerkClient } from "@clerk/express";
import courseModel from "../models/course.model.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.util.js";
import purchaseModel from "../models/purchase.model.js";
import userModel from "../models/user.model.js";

// Update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator",
      },
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const addCourse = async (req, res) => {
  try {
    const educatorId = req.auth.userId;
    const { courseData } = req.body;
    const image = req.file;

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


// get educator Courses
export const getEducatorCourses=async(req,res)=>{
  try {
    const educatorId = req.auth.userId;

    const courses = await courseModel.find({ educator: educatorId });
    res.json({success:true,courses});
  } catch (error) {
    console.error("FETCH COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}



// get educator dashboard data (total earning,enrolled students, no. of courses)

export const educatorDashboardData = async (req, res) => {
  try {
    const educatorId = req.auth?.userId;

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

    const totalEarnings = purchases.reduce(
      (sum, p) => sum + p.amount,
      0
    );

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




// get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.auth?.userId;

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
      userId: p.userId, // Clerk userId
      courseTitle: courseMap.get(p.courseId.toString()),
      purchasedAt: p.createdAt,
      amount: p.amount,
    }));

    res.json({
      success: true,
      enrolledStudents,
    });
  } catch (error) {
    console.error("ENROLLED STUDENTS ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

