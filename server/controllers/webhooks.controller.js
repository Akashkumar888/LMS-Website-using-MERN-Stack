import { Webhook } from "svix";
import userModel from "../models/user.model.js";

export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // RAW body from express.raw()
    const payload = req.body.toString("utf8");

    await webhook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(payload);

    switch (type) {
      case "user.created": {
        await userModel.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
          enrolledCourses: [],
        });
        break;
      }

      case "user.updated": {
        await userModel.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        });
        break;
      }

      case "user.deleted": {
        await userModel.findByIdAndDelete(data.id);
        break;
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};
