
import express from "express";
import { clerkWebhooks } from "../controllers/webhooks.controller.js";

const webhookRouter = express.Router();

// IMPORTANT: use raw body for Clerk
webhookRouter.post(
  "/clerk",
  express.raw({ type: "application/json" }),
  clerkWebhooks
);

export default webhookRouter;
