const httpStatusText = require("../utils/http.status.text");
const asyncWrapper = require("../middlewares/async-wrapper");
const User = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const appError = require("../utils/appError");
const generate_JWT_token = require("../utils/generate_JWT_token");

const getAllUsers = asyncWrapper(async (req, res) => {
  console.log(req.headers);

  const query = req.query;
  const limit = query.limit || 10;
  const page = query.page || 1;
  const skip = (page - 1) * limit;
  console.log("query", query);

  //TODO GET USERS FROM DB
  const users = await User.find({}, { __v: false, password: false })
    .limit(limit)
    .skip(skip);
  console.log("users", users);
  return res.json({ status: httpStatusText.SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  console.log("req.body", req.body);

  const { firstName, lastName, email, password, role } = req.body;

  const existingPrevUser = await User.findOne({ email: email });
  if (existingPrevUser) {
    const err = appError.create(
      "User already exists",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  //Password Encryption By Hashing
  const hashedPassword = await bcryptjs.hash(password, 10);
  console.log("hashedPassword", hashedPassword);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar : req.file.path
  });

  console.log("newUser", newUser);

  //generate JWT token
  const token = await generate_JWT_token({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  console.log("token", token);
  newUser.token = token;

  await newUser.save();

  return res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: { user: newUser },
  });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const err = appError.create(
      "All fields are required",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    const err = appError.create(
      "User does not exist",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }

  const matchedPassword = await bcryptjs.compare(password, user.password);

  if (user && matchedPassword) {
    const token = await generate_JWT_token({
      email: user.email,
      id: user._id,
      role: user.role,
    });

    return res.status(200).json({
      status: httpStatusText.SUCCESS,

      data: { token },
    });
  } else {
    const err = appError.create(
      "Invalid Credentials",
      400,
      httpStatusText.FAIL
    );
    return next(err);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
