const Course = require("../models/course");
const Lesson = require("../models/Lesson");

exports.getPublicCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "approved" })
      .select("title price instructor thumbnail")
      .populate("instructor", "name");
    res.status(200).json({ success: true, courses });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findOne({ _id: req.params.id, status: "approved" })
      .populate("instructor", "name email");

    if (!course) return res.status(400).json({
      success: false,
      message: "Course doesn't exist or not approved"
    });

    const lessons = await Lesson.find({ course: req.params.id })
      .select("title order")
      .sort("order");

    res.status(200).json({
      success: true,
      course: {
        title: course.title,
        description: course.description,
        instructor: course.instructor.name,
        price: course.price,
        thumbnail: course.thumbnail,
        category: course.category,
        totalLessons: lessons.length,
        level: course.level || "Beginner",
        language: course.language || "English"
      },
      syllabus: lessons,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// exports.getAllCourses = async (req, res) => {
//   try {
//     const { search } = req.query;
//     const query = {};

//     if (search) {
//       const regex = new RegExp(search, 'i'); // case-insensitive
//       query.$or = [
//         { title: regex },
//         { category: regex },
//       ];
//     }

//     const courses = await Course.find(query).select("title price instructor thumbnail");
//     res.status(200).json({ success: true, courses });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };
exports.searchCourses = async (req, res) => {
  try {
    const { keyword, category, language, page = 1, limit = 10 } = req.query;
    let filter = { status: "approved" };
    if (keyword) filter.title = { $regex: keyword, $options: "i" };
    if (category) filter.category = category;
    if (language) filter.language = language;

    const courses = await Course.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("instructor", "name");

    const total = await Course.countDocuments(filter);

    res.json({ success: true, courses, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Search error" });
  }
};

