

import express from "express";
import { stripewebhooks } from "../controllers/webhooks.controller.js";

const stripeRouter = express.Router();


stripeRouter.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripewebhooks
);
export default stripeRouter;
