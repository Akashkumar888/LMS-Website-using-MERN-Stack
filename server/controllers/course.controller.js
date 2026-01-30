import courseModel from "../models/course.model.js";

export const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ isPublished: true })
      .select("-courseContent -enrolledStudents")
      .populate("educator", "name email imageUrl");

    res.json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("GET ALL COURSES ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await courseModel
      .findOne({ _id: id, isPublished: true })
      .populate("educator", "name email imageUrl");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const courseData = course.toObject();

    courseData.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          delete lecture.lectureUrl;
        }
      });
    });

    res.json({
      success: true,
      courseData,
    });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
