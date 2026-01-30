import mongoose from "mongoose";


const lectureSchema = new mongoose.Schema(
  {
    lectureId: { type: String, required: true },
    lectureTitle: { type: String, required: true },
    lectureDuration: { type: Number, required: true }, // minutes
    lectureUrl: { type: String, required: true }, // video URL
    isPreviewFree: { type: Boolean, default: false },
    lectureOrder: { type: Number, required: true },
  },
  { _id: false }
);


const chapterSchema = new mongoose.Schema(
  {
    chapterId: { type: String, required: true },
    chapterOrder: { type: Number, required: true },
    chapterTitle: { type: String, required: true },
    chapterContent: [lectureSchema],
  },
  { _id: false }
);


const ratingSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: "User", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true, _id: false }
);


const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    courseDescription: {
      type: String,
      required: true,
    },

    courseThumbnail: {
      type: String,
      default: "",
    },

    coursePrice: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    courseContent: [chapterSchema],

    courseRating: [ratingSchema],

    educator: {
      type: String,
      ref: "User",
      required: true,
    },

    enrolledStudents: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    minimize: false,
  }
);


const courseModel = mongoose.models.Course || mongoose.model("Course", courseSchema);

export default courseModel;
