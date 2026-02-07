import { clerkClient } from "@clerk/express";
import userModel from "../models/user.model.js";
import purchaseModel from "../models/purchase.model.js";
import courseModel from "../models/course.model.js";
import stripeInstance from "../configs/stripeInstance.config.js";
import courseProgressModel from "../models/courseProgress.model.js";

// get user data
export const getUserData = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;

    let user = await userModel.findById(userId);

    // 🔥 CREATE USER IF NOT EXISTS
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);

      user = await userModel.create({
        _id: userId,
        name: clerkUser.firstName + " " + (clerkUser.lastName || ""),
        email: clerkUser.emailAddresses[0].emailAddress,
        imageUrl: clerkUser.imageUrl,
        enrolledCourses: [],
      });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// user enrolled courses with lecture links
export const userEnrolledCourses = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;

    const userData = await userModel
      .findById(userId)
      .populate("enrolledCourses");

    if (!userData) {
      return res.json({
        success: true,
        enrolledCourses: [],
      });
    }

    res.json({
      success: true,
      enrolledCourses: userData.enrolledCourses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth()?.userId;

    if (!courseId) {
      return res.status(400).json({ success: false, message: "Course ID required" });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    const alreadyPurchased = await purchaseModel.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (alreadyPurchased) {
      return res.status(400).json({ success: false, message: "Already purchased" });
    }

    // price in rupees
    const discountedPrice =
      course.coursePrice - (course.discount / 100) * course.coursePrice;

    // convert ONCE → paise
    const amountInPaise = Math.round(discountedPrice * 100);

    // store paise
    const purchase = await purchaseModel.create({
      courseId: course._id,
      userId,
      amount: amountInPaise,
      currency: "inr",
      status: "pending",
    });

    const session = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: course.courseTitle,
            },
            unit_amount: amountInPaise, // ✅ paise
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      metadata: {
        purchaseId: purchase._id.toString(),
        courseId: course._id.toString(),
        userId,
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("PURCHASE COURSE ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update user course Progress
export const updateUserCourseProgress = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    const { courseId, lectureId } = req.body;

    if (!userId || !courseId || !lectureId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Details" });
    }

    const progressData = await courseProgressModel.findOne({
      userId,
      courseId,
    });

    if (progressData) {
      if (progressData.lectureCompleted.includes(lectureId)) {
        return res
          .status(200)
          .json({ success: true, message: "Lecture Already Completed" });
      }

      progressData.lectureCompleted.push(lectureId);
      await progressData.save();
    } else {
      await courseProgressModel.create({
        userId,
        courseId,
        lectureCompleted: [lectureId],
      });
    }

    res.status(200).json({ success: true, message: "Progress Updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get User Course Progress
export const getUserCourseProgress = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    const { courseId } = req.body;

    if (!userId || !courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Details" });
    }

    const progressData = await courseProgressModel.findOne({
      userId,
      courseId,
    });

    res.status(200).json({ success: true, progressData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add user rating to course
export const addUserRating = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    const { courseId, rating } = req.body;

    // ✅ fixed condition
    if (!courseId || !userId || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Details" });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res
        .status(400)
        .json({ success: false, message: "Course not found." });
    }

    const user = await userModel.findById(userId);
    // ✅ fixed enrolled logic
    if (!user || !user.enrolledCourses.includes(courseId)){
      return res
        .status(400)
        .json({
          success: false,
          message: "User has not purchased this course.",
        });
    }

    // ✅ fixed comparison
    const existingRatingIndex = course.courseRatings.findIndex(
      (r) => r.userId.toString() === userId,
    );

    if (existingRatingIndex > -1) {
      course.courseRatings[existingRatingIndex].rating = rating;
    } else {
      course.courseRatings.push({ userId, rating });
    }

    await course.save();

    res.status(200).json({ success: true, message: "Rating added" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
