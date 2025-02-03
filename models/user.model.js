const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require("../utils/user_roles");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: [validator.isEmail, "Field Must be a valid email address"],
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  role: {
    type: String,
    enum: [userRoles.USER, userRoles.ADMIN, userRoles.MANAGER],
    default: userRoles.USER,
  },
  avatar: {
    type: String,
    default: "uploads/profile.png"
  }
});

module.exports = mongoose.model("User", userSchema);
