import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'

import { ClerkProvider } from '@clerk/clerk-react';

// Import your Publishable Key
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

  if (!PUBLISHABLE_KEY) {
    throw new Error('Missing Publishable Key')
  }


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl='/'>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  </ClerkProvider>
  </BrowserRouter>
)

// ✅ What you did RIGHT
// 1️⃣ Environment Variables (Correct)
// VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
// VITE_BASEURL=http://localhost:4000


// ✔ Correct naming (VITE_ prefix is required in Vite)
// ✔ Publishable key (not secret key)
// ✔ No quotes needed

// 2️⃣ Importing Clerk Correctly
// import { ClerkProvider } from '@clerk/clerk-react';


// ✔ Correct package
// ✔ Correct import

// 3️⃣ Accessing Env Variable (Correct)
// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error('Missing Publishable Key')
// }


// ✔ Correct Vite syntax
// ✔ Good defensive check

// 4️⃣ Wrapping App with ClerkProvider (Correct)
// <BrowserRouter>
//   <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
//     <AppContextProvider>
//       <App />
//     </AppContextProvider>
//   </ClerkProvider>
// </BrowserRouter>


// ✔ ClerkProvider is above App
// ✔ Works perfectly with react-router-dom
// ✔ afterSignOutUrl="/" is valid

// This is exactly how Clerk expects it.

// ⚠️ VERY IMPORTANT CHECKS (Most People Miss These)
// 🔴 1️⃣ Restart Vite Server

// Whenever you change .env:

// npm run dev
// # or
// pnpm dev


// ❗ Vite does NOT reload env variables automatically.

// 🔴 2️⃣ Make Sure .env Is at ROOT

// Your file structure must be:

// project-root/
//  ├─ .env
//  ├─ src/
//  ├─ package.json
//  └─ vite.config.js


// ❌ Not inside src/

// 🔴 3️⃣ Use Clerk Components Somewhere

// Just wrapping is not enough.
// You must use at least one Clerk component:

// import { SignIn, SignUp, UserButton } from "@clerk/clerk-react";


// Example:

// <UserButton afterSignOutUrl="/" />


// Otherwise you’ll feel like “Clerk is not working” 😄

// ✅ Minimal Test to Confirm Clerk Is Working

// Add this inside any component:

// import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

// function Test() {
//   return (
//     <>
//       <SignedOut>
//         <SignInButton />
//       </SignedOut>

//       <SignedIn>
//         <UserButton />
//       </SignedIn>
//     </>
//   );
// }


// If this works → Clerk is 100% integrated ✅
// ✅ Final Verdict

// ✔ Environment variables — Correct
// ✔ ClerkProvider setup — Correct
// ✔ Router integration — Correct
// ✔ Context provider nesting — Correct

// 🎯 Your Clerk integration is done properly.