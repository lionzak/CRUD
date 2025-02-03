const express = require("express");
const multer = require("multer");
const httpStatusText = require("../utils/http.status.text");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileType = file.mimetype.split("/")[1];

    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileType);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(appError.create("Invalid file type", 400), false);
  }
};

const upload = multer({ dest: "uploads/", storage , fileFilter});
const router = express.Router();
const usersController = require("../controller/users.controller");
const { verifyToken } = require("../middlewares/verify_token");
const appError = require("../utils/appError");

//get all users

//register

//login

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.register);

router.route("/login").post(usersController.login);

module.exports = router;
