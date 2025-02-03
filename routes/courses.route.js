const express = require("express");
const router = express.Router();
const { validationSchema } = require("../middlewares/validation-schema");

const courseController = require("../controller/courses.controller");
const { verifyToken } = require("../middlewares/verify_token");
const userRoles = require("../utils/user_roles");
const allowedTo = require("../middlewares/allowedTo");

router.use(express.json());

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(
    verifyToken,
    allowedTo(userRoles.MANAGER),
    validationSchema,
    courseController.createCourse
  );

router
  .route("/:courseId")
  .get(courseController.getCourseById)
  .patch(courseController.updateCourse)
  .delete(
    verifyToken,
    allowedTo(userRoles.ADMIN, userRoles.MANAGER),
    courseController.deleteCourse
  );

module.exports = router;
