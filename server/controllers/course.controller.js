import courseModel from "../models/course.model.js";


export const getAllCourse = async (req, res) => {
  try {
    const courses = await courseModel
      .find({ isPublished: true })
      .select("-courseContent -enrolledStudents");

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

    const course = await courseModel.findOne({
      _id: id,
      isPublished: true,
    });

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

    res.json({ success: true, courseData });
  } catch (error) {
    console.error("GET COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const publishCourse = async (req, res) => {
  try {
    const auth = req.auth();
    const userId = auth?.userId;
    const { courseId } = req.params;

    const course = await courseModel.findOneAndUpdate(
      { _id: courseId, educator: userId },
      { isPublished: true },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, message: "Course published" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

