import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import AppContext from "../../context/AppContext";
import CourseCard from "../../components/student/CourseCard";
import { assets } from "../../assets/assets";
import Footer from "../../components/student/Footer";

const CourseList = () => {
  const { navigate, allCourses } = useContext(AppContext);
  const { input } = useParams();

  const [filteredCourse, setFilteredCourse] = useState([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      input
        ? setFilteredCourse(
            tempCourses.filter((item) =>
              item.courseTitle.toLowerCase().includes(input.toLowerCase())
            )
          )
        : setFilteredCourse(tempCourses);
    }
  }, [allCourses, input]);

  return (
    <>
    <div className="relative md:px-36 px-8 pt-20 text-left">
  {/* Header */}
  <div className="flex md:flex-row flex-col gap-6 items-start w-full">
    <div>
      <h1 className="text-4xl font-semibold text-gray-800">Course List</h1>
      <p className="text-gray-500">
        <span
          className="text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          Home
        </span>{" "}
        / Course List
      </p>
    </div>

    <div className="w-full md:max-w-xl md:ml-auto">
      <SearchBar data={input} />
    </div>
  </div>

  {/* Active Filter */}
  {input && (
    <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 border rounded text-gray-600">
      <p className="capitalize">{input}</p>
      <img
        src={assets.cross_icon}
        alt="clear"
        className="cursor-pointer w-3"
        onClick={() => navigate("/course-list")}
      />
    </div>
  )}

  {/* Courses */}
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:p-0">
    {filteredCourse.map((course, index) => (
      <CourseCard key={index} course={course} />
    ))}
  </div>
</div>
  <Footer/>
    </>
  );
};

export default CourseList;

// 🧠 Golden Rule (Remember this forever)
// If the URL does not have :param, useParams() will ALWAYS return undefined.
// No error
// No warning
// Just empty data
// 🎯 Final Answer (Short & Clear)
// You did nothing wrong.
// You copied:
// the CourseList code
// but NOT the route update that comes later
// So your code looks correct, but the URL doesn’t match yet.
