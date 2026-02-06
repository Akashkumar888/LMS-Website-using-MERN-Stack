

// import axios from 'axios'

// // ✅ Create a pre-configured Axios instance
// const api = axios.create({
//   baseURL: import.meta.env.VITE_BASEURL,
//   withCredentials: true, // this MUST match the backend CORS credentials:true
// });

// // Attach token automatically if it exists
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );


// export default api; // ✅ make sure this line is present




// this is use when clerkMiddleware use 
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL,
  withCredentials: true,
});

// 🔐 Clerk-safe token injection (NO hooks)
api.interceptors.request.use(
  async (config) => {
    if (window.Clerk?.session) {
      const token = await window.Clerk.session.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;

