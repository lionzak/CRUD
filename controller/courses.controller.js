const { validationResult } = require("express-validator");
const Course = require("../models/course.model");
const httpStatusText = require("../utils/http.status.text");
const asyncWrapper = require("../middlewares/async-wrapper");
const appError = require("../utils/appError");

const getAllCourses = asyncWrapper(async (req, res) => {
  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  console.log("query", query);

  const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
  console.log("courses", courses);
  return res.json({ status: httpStatusText.SUCCESS, data: { courses } });
});

const getCourseById = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    console.log("Changed and return a new error");
    const err = appError.create("Course Not Found", 404, httpStatusText.FAIL);
    return next(err);
    // return res
    //   .status(404)
    //   .json({ status: httpStatusText.FAIL, data: { course: null } });
  }
  return res.json({ status: httpStatusText.SUCCESS, data: { course } });
  // try {
  // } catch (err) {
  //   res.status(400).json({
  //     status: httpStatusText.ERROR,
  //     data: null,
  //     message: err.message,
  //     code: 400,
  //   });
  // }
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  console.log("errors", errors);

  if (!errors.isEmpty()) {
    // const error = new Error();
    // error.statusCode = 400;
    // error.message = "Validation failed";

    const err = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(err);
    // return res.status(400).json({
    //   status: httpStatusText.FAIL,
    //   data: errors.array(),
    // });
  }

  const newCourse = new Course(req.body);
  newCourse.save();

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { course: newCourse },
  });
});
const updateCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  const updateCourse = await Course.findByIdAndUpdate(courseId, {
    $set: { ...req.body },
  });
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: { course: updateCourse },
  });
});
const deleteCourse = asyncWrapper(async (req, res) => {
  const courseId = req.params.courseId;
  await Course.deleteOne({ _id: courseId });

  return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
