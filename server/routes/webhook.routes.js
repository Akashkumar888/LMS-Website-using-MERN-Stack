import express from "express";
import { clerkWebhooks, stripewebhooks } from "../controllers/webhooks.controller.js";

const webhookRouter = express.Router();

// 🔐 Clerk Webhook (raw body REQUIRED)
webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

// 💳 Stripe Webhook (raw body REQUIRED)
webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripewebhooks
);

export default webhookRouter;
