
import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const AppContext=createContext();

export const AppContextProvider=({children})=>{

  const currency=import.meta.env.VITE_CURRENCY;

  const navigate=useNavigate();
  const [allCourses, setAllCourses] = useState([]);


// fetch all courses
const fetchAllCourses=async()=>{
  setAllCourses(dummyCourses);
}

// function to calculate average rating of course
const calculateRating=(course)=>{
 if(course.courseRatings.length===0){
  return 0;
 }
 let totalRating=0;
 course.courseRatings.forEach(rating=>{
  totalRating+=rating.rating;
 })
 return totalRating/course.courseRating.length;
}

useEffect(()=>{
  fetchAllCourses();
},[]);

 const value={
 currency,
 allCourses,
 navigate,
 calculateRating,
 };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext;