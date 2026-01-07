
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import AppContext from '../../context/AppContext'
import CourseCard from './CourseCard';

const CourseSection = () => {

  const {allCourses}=useContext(AppContext);

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base '>
       Discover our top-rated courses across various categories. From coding and design to <br /> business and wellness, our courses are crafted to deliver results. 
      </p>
      {/* ✅ RESPONSIVE GRID (Tailwind v4 correct way) */}
      <div className="grid grid-cols-[var(--grid-cols-auto)] gap-6 md:my-16 my-10">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>

      <Link to={'/course-list'} onClick={()=>scrollTo(0,0)}>Show all courses
      </Link>
    </div>
  )
}

export default CourseSection

// 1️⃣ Using window.scrollTo() (Simple & Direct)
// 🔹 Scroll to TOP
// window.scrollTo(0, 0)
// 🔹 Scroll to BOTTOM
// window.scrollTo({
//   top: document.body.scrollHeight,
//   behavior: 'smooth'
// })
 
// ✅ Fix your current code (Top scroll)
// Your current code is almost correct, just make it smooth and safer.
// <Link
//   to="/course-list"
//   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
// >
//   Show all courses
// </Link>
// ✔ Scrolls to top
// ✔ Smooth animation
// ✔ Works on route change

// 2️⃣ Scroll DOWN to a specific section (without useRef)
// Example: scroll 300px down
// window.scrollTo({
//   top: 300,
//   behavior: 'smooth'
// })
// ⚠️ This is not reliable for dynamic content → use useRef instead.
// 3️⃣ BEST PRACTICE: useRef for Scroll (Industry Way)
// useRef allows you to scroll to exact elements, not random pixels.
// 🔹 Example: Scroll DOWN to Course Section
// Step 1: Create a ref
// import { useRef } from 'react'
// const courseRef = useRef(null)
// Step 2: Attach ref to element
// <div ref={courseRef}>
//   <h2>Learn from the best</h2>
// </div>
// Step 3: Scroll to that section
// courseRef.current.scrollIntoView({
//   behavior: 'smooth'
// })
// 4️⃣ Full Example: TOP & DOWN Scroll using useRef
// ✅ Updated CourseSection.jsx
// import React, { useRef } from 'react'
// import { Link } from 'react-router-dom'
// const CourseSection = () => {
//   const topRef = useRef(null)
//   const sectionRef = useRef(null)
//   const scrollToTop = () => {
//     topRef.current.scrollIntoView({ behavior: 'smooth' })
//   }
//   const scrollToSection = () => {
//     sectionRef.current.scrollIntoView({ behavior: 'smooth' })
//   }
//   return (
//     <>
//       {/* TOP reference */}
//       <div ref={topRef}></div>
//       <button onClick={scrollToSection}>
//         Scroll Down to Courses
//       </button>
//       <div style={{ height: '600px' }}></div>
//       {/* COURSE SECTION */}
//       <div ref={sectionRef}>
//         <h2>Learn from the best</h2>
//         <p>
//           Discover our top-rated courses across various categories.
//           From coding and design to business and wellness.
//         </p>
//         <Link
//           to="/course-list"
//           onClick={scrollToTop}
//         >
//           Show all courses
//         </Link>
//       </div>
//     </>
//   )
// }

// export default CourseSection
// 6️⃣ Scroll on Route Change (BONUS)
// If you want to always scroll to top when page changes:
// import { useEffect } from 'react'
// import { useLocation } from 'react-router-dom'
// const ScrollToTop = () => {
//   const { pathname } = useLocation()
//   useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [pathname])
//   return null
// }

// Use once in App.jsx.
// 🧠 Key Takeaways
// ✔ scrollTo(0,0) → top
// ✔ document.body.scrollHeight → bottom
// ✔ useRef + scrollIntoView() → best practice
// ✔ Smooth scrolling → better UX
// ✔ Route-based scrolling → professional apps