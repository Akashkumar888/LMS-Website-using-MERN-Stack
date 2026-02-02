import { clerkClient } from "@clerk/express";
import userModel from "../models/user.model.js";
import purchaseModel from "../models/purchase.model.js";
import courseModel from "../models/course.model.js";
import stripeInstance from "../configs/stripeInstance.config.js";

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
    const auth = req.auth();
    const userId = auth?.userId;


    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // 🔐 Ensure user exists in DB
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found in database",
      });
    }

    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ❌ Prevent duplicate purchase
    const alreadyPurchased = await purchaseModel.findOne({
      userId,
      courseId,
      status: "completed",
    });

    if (alreadyPurchased) {
      return res.status(400).json({
        success: false,
        message: "Course already purchased",
      });
    }

    // 💰 Price calculation (SAFE)
    const discountedPrice =
      course.coursePrice -
      (course.discount / 100) * course.coursePrice;

    const finalAmount = Math.round(discountedPrice * 100) / 100; // ₹xx.xx

    // 🧾 Create purchase record
    const purchase = await purchaseModel.create({
      courseId: course._id,
      userId,
      amount: finalAmount, // ✅ NUMBER
      status: "pending",
    });

    // 💳 Stripe expects smallest currency unit
    const currency = process.env.CURRENCY?.toLowerCase() || "inr";

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: course.courseTitle,
          },
          unit_amount: Math.round(finalAmount * 100), // paisa
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      metadata: {
        purchaseId: purchase._id.toString(),
        courseId: course._id.toString(),
        userId,
      },
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("PURCHASE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
