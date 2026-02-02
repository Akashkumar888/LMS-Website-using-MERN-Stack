
import express from "express";
import { clerkWebhooks, stripewebhooks } from "../controllers/webhooks.controller.js";

const webhookRouter = express.Router();

// IMPORTANT: use raw body for Clerk
webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

webhookRouter.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripewebhooks
);
export default webhookRouter;
