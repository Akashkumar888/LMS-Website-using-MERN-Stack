import { Webhook } from "svix";
import userModel from "../models/user.model.js";

// Clerk Webhook Controller
// This endpoint receives events from Clerk (user.created, user.updated, user.deleted)
// and syncs Clerk users into MongoDB.

export const clerkWebhooks = async (req, res) => {
  try {
    // 1️⃣ Create a Webhook instance using your Clerk Webhook Secret
    // This secret is used to verify that the request truly came from Clerk
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // 2️⃣ Verify the webhook signature
    // Clerk sends these 3 headers for verification:
    //  - svix-id
    //  - svix-timestamp
    //  - svix-signature
    await webhook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // 3️⃣ Extract event payload from Clerk webhook body
    const { data, type } = req.body;

    // 4️⃣ Handle different Clerk events
    switch (type) {
      // ✅ When a new user signs up in Clerk
      case "user.created": {
        const userData = {
          _id: data.id, // Clerk User ID as MongoDB _id
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
          enrolledCourses: [],
        };

        await userModel.create(userData);
        break;
      }

      // ✅ When a user updates profile in Clerk
      case "user.updated": {
        const updatedUserData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await userModel.findByIdAndUpdate(data.id, updatedUserData);
        break;
      }

      // ✅ When a user is deleted from Clerk
      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        break;
      }

      default:
        // Ignore other Clerk events you don’t need
        break;
    }

    // 5️⃣ Respond back to Clerk — REQUIRED
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error.message);

    // If verification fails or DB fails, tell Clerk
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
