import { Webhook } from "svix";
import userModel from "../models/user.model.js";
import stripeInstance from "../configs/stripeInstance.config.js";
import Stripe from "stripe";
import purchaseModel from "../models/purchase.model.js";
import courseModel from "../models/course.model.js";

/* ================= CLERK WEBHOOK ================= */
export const clerkWebhooks = async (req, res) => {
  try {
    const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    const payload = req.body.toString("utf8");

    await webhook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = JSON.parse(payload);

    switch (type) {
      case "user.created":
        await userModel.create({
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
          enrolledCourses: [],
        });
        break;

      case "user.updated":
        await userModel.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        });
        break;

      case "user.deleted":
        await userModel.findByIdAndDelete(data.id);
        break;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Clerk Webhook Error:", error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export const stripewebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {

    /* ✅ INDUSTRY STANDARD */
    case "checkout.session.completed": {
      const session = event.data.object;

      const { purchaseId } = session.metadata || {};
      if (!purchaseId) {
        console.log("❌ Missing purchaseId in metadata");
        break;
      }

      const purchase = await purchaseModel.findById(purchaseId);
      if (!purchase || purchase.status === "completed") break;

      const user = await userModel.findById(purchase.userId);
      const course = await courseModel.findById(purchase.courseId);

      if (!user || !course) break;

      // enroll user safely
      if (!course.enrolledStudents.includes(user._id)) {
        course.enrolledStudents.push(user._id);
        await course.save();
      }

      if (!user.enrolledCourses.includes(course._id)) {
        user.enrolledCourses.push(course._id);
        await user.save();
      }

      purchase.status = "completed";
      await purchase.save();

      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};
