# Full Stack LMS Website (MERN)

Comprehensive Learning Management System built with the MERN stack (MongoDB, Express, React, Node). This repository contains both the frontend client and the backend server for a fully-featured LMS supporting educator course creation, student enrollment and playback, payments, and admin dashboards.

## Key Features

- **Educator dashboard:** Create, update and manage courses and content.
- **Student experience:** Browse courses, view details, play video lessons, and track progress.
- **Payments:** Integrations with Razorpay / Stripe for course purchases and webhooks to process payments.
- **Media upload:** Cloudinary integration for storing course images and videos.
- **Authentication:** User accounts for educators and students with role-based access control.
- **Responsive UI:** Built with Vite + React for fast development and production builds.

## Tech Stack

- Backend: `Node.js`, `Express`, `MongoDB` (Mongoose)
- Frontend: `React` (Vite)
- Storage & Media: `Cloudinary`
- Payments: `Razorpay`, `Stripe` (server-side webhooks)
- Deployment: configured for Vercel (server & client) but can be hosted elsewhere

## Repository Structure

- `client/` — React frontend (Vite)
  - `src/` — React app source
  - `src/components/` — UI components for educator & student
  - `src/pages/` — Page level components
  - `src/axios/api.js` — API client
- `server/` — Express backend
  - `configs/` — DB and third-party configs (Cloudinary, Stripe, Razorpay)
  - `controllers/` — Route controllers
  - `middlewares/` — Auth and upload middleware
  - `models/` — Mongoose models
  - `routes/` — Express route definitions
  - `utils/` — Utilities (upload helpers)

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (Atlas or local)
- Cloudinary account (for media uploads)
- Razorpay and/or Stripe account (if using payments)

## Environment Variables

Create `.env` files for both `server` and `client` as needed. Example variables (adjust names if code expects different keys):

Server `.env` (example):

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/lms?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
WEBHOOK_SECRET=your_webhook_secret_for_payment_provider
```

Client `.env` (example - Vite uses `VITE_` prefix):

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=FullStackLMS
```

Note: Adjust `VITE_API_BASE_URL` for production to point to your deployed backend.

## Local Setup and Run

1. Clone the repository and install dependencies for both client and server.

Backend (server):

```bash
cd server
npm install
# start in development with nodemon (if configured):
npm run dev
# or production start:
npm start
```

Frontend (client):

```bash
cd client
npm install
npm run dev
```

Open the app at the port shown by Vite (commonly `http://localhost:5173`) and ensure the backend is running at the `VITE_API_BASE_URL` you set.

## Deployment

- This project includes `vercel.json` files and is ready for deployment to Vercel. Configure environment variables in Vercel for both client and server projects.
- For other hosts, build the client (`npm run build` in `client`) and serve static files or host separately; deploy the server to a Node-compatible host (Heroku, Render, DigitalOcean, etc.).

## Important Files

- `server/server.js` — Express app entry
- `client/src/main.jsx` — React entry (Vite)
- `client/src/axios/api.js` — API wrapper used by frontend
- `server/configs/db.config.js` — MongoDB connection
- `server/configs/cloudinary.config.js` — Cloudinary config

## Testing Payments & Webhooks

- When testing payment webhooks locally, use a tunneling service (ngrok) or your platform's webhook setup to forward events to the running server. Ensure `WEBHOOK_SECRET` is configured correctly and webhook routes are reachable.

## Troubleshooting

- CORS errors: ensure the backend enables CORS and the frontend uses the correct API base URL.
- MongoDB connection issues: verify `MONGODB_URI` and network access (Atlas IP whitelist).
- File uploads failing: verify Cloudinary credentials and that `multer` middleware is properly applied to upload routes.

## Contributing

Contributions are welcome. Open an issue or submit a pull request with a clear description of your change.

## License

This project does not include a license file by default. Add a `LICENSE` file if you intend to open-source with a specific license.

---

If you want, I can also:

- Add a `docs/` folder with environment templates and sample requests
- Create a `Makefile` / starter scripts for local dev
- Add CI workflow for tests and linting

Tell me which of these you'd like next.
