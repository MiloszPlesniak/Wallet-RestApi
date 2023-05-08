const fs = require("fs/promises");
// obrabianie obrazków
const jimp = require("jimp");
const path = require("path");
// generowanei id
const { v4: uuidv4 } = require("uuid");
const { registerValidate, User, hashPassword } = require("../models/users.js");

const loginHandler = require("../auth/loginHandler");
const { log } = require("console");

const getUserByEmail = async (email) => {
  const user = User.findOne({ email });
  return user;
};
const getUserById = async (id) => {
  const user = User.findById(id);
  return user;
};

const createUser = async (email, password) => {
  try {
    const newUser = new User({
      email,
      password: hashPassword(password),
      verificationToken: uuidv4(),
    });
    newUser.save();
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

const registerUser = async (userData) => {
  const { error } = registerValidate.validate(userData);
  if (error) {
    return { code: 400, message: error.details[0].message };
  }
  const { email, password } = userData;
  if (await getUserByEmail(email)) {
    return { code: 409, message: "Email in use" };
  }
  try {
    const user = await createUser(email, password);
    // await sendEmail(
    //     email,
    //     `http://localhost:3000/api/users/verify/${user.verificationToken}`
    // );
    return { code: 201, message: user };
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (userData) => {
  const { error } = registerValidate.validate(userData);
  if (error) {
    return { code: 400, message: error.details[0].message };
  }

  const { email, password } = userData;

  const user = await getUserByEmail(email);
  // if (!user.verify)
  //   return { code: 401, message: "Email has not been verified" };
  const token = await loginHandler(password, user);
  if (!user || !token) {
    return { code: 401, message: "Email or password is wrong" };
  } else {
    await User.findByIdAndUpdate(user._id, { token: token.token });
    return { code: 200, message: user.email };
  }
};

const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
  return { code: 204, message: "" };
};

const currentUser = async (id) => {
  const user = await User.findById(id);
  console.log(id);
  if (!user) {
    return { code: 401, message: "Not authorized" };
  } else {
    return { code: 200, message: user.email };
  }
};

const emailVerify = async (verificationToken) => {
  const user = await User.findOne({ verificationToken });

  if (!user || user.verify) {
    return { code: 404, message: "User not found" };
  }
  try {
    editUser(user.id, { verify: true });
    return { code: 200, message: "Verification successful" };
  } catch (error) {
    console.log(error);
    return { code: 500, message: error };
  }
};

const resendingTheEmail = async (email) => {
  if (!email) return { code: 400, message: "Missing required field email" };
  const user = await getUserByEmail(email);
  if (!user) return { code: 404, message: "User not found" };
  if (user.verify)
    return { code: 400, message: "Verification has already been passed" };
  // await sendEmail(
  //     email,
  //     `http://localhost:3000/api/users/verify/${user.verificationToken}`
  // );
  return { code: 200, message: "Verification email sent" };
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  emailVerify,
  resendingTheEmail,
  getUserById,
  getUserByEmail,
};
