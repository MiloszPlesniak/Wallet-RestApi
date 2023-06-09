const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Schema = mongoose.Schema;

const users = new Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
  balance: {
    type: Number,
    default: 0.0,
  },
});

const User = mongoose.model("User", users);

const hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};
const postRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
  name: Joi.string().min(2).max(50).required(),
});
const postLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(50).required(),
});

module.exports = {
  registerValidate: postRegisterSchema,
  User,
  hashPassword,
  loginValidate: postLoginSchema,
};
