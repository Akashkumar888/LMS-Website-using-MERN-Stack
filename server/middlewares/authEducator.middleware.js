import { clerkClient } from "@clerk/express";

export const authEducator = async (req, res, next) => {
  try {
    const userId = req.auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata?.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Educator access only",
      });
    }

    next();
  } catch (error) {
    console.error("EDUCATOR AUTH ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
