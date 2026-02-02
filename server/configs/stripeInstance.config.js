
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("❌ STRIPE_SECRET_KEY is missing");
}

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
export default stripeInstance;
