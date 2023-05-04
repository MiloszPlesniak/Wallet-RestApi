const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const gravatar = require("gravatar");
const Schema = mongoose.Schema;

const users = new Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarUrl: {
    type: String,
    default: gravatar.url("miloszplesniak@gmail.com"),
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

const User = mongoose.model("user", users);

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};

const postRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});
const changeSubSchema = Joi.object({
  subscription: Joi.string().valid("starter", "pro", "business"),
});
module.exports = {
  User,
  registerValidate: postRegisterSchema,
  hashPassword,
  changeSubValidate: changeSubSchema,
};
