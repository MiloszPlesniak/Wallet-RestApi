const { v4: uuidv4 } = require("uuid");
const {
  registerValidate,
  loginValidate,
  User,
  hashPassword,
} = require("../models/users.js");

const loginHandler = require("../auth/loginHandler");
const { getAllTransactions } = require("../controllers/transaction.js");

const getUserByEmail = async (email) => {
  const user = User.findOne({ email });
  return user;
};
const getUserById = async (id) => {
  const user = User.findById(id);
  return user;
};

const createUser = async (email, password, name) => {
  try {
    const newUser = new User({
      email,
      password: hashPassword(password),
      name,
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
  const { email, password, name } = userData;
  if (await getUserByEmail(email)) {
    return { code: 409, message: "Email in use" };
  }
  try {
    const user = await createUser(email, password, name);

    // await sendEmail(
    //     email,
    //     `http://localhost:3000/api/users/verify/${user.verificationToken}`
    // );
    return {
      code: 201,
      message: { email: user.email, name: user.name, password: user.password },
    };
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (userData) => {
  const { error } = loginValidate.validate(userData);
  if (error) {
    return { code: 400, message: error.details[0].message };
  }

  const { email, password } = userData;

  const userCheck = await getUserByEmail(email);
  // if (!user.verify)
  //   return { code: 401, message: "Email has not been verified" };
  const { user, token } = await loginHandler(password, userCheck);

  if (!userCheck || !token) {
    return { code: 401, message: "Email or password is wrong" };
  } else {
    await User.findByIdAndUpdate(user._id, { token });
    const { balance, income, expense } = await setBalance(user._id);
    return {
      code: 200,
      message: {
        email: user.email,
        passwprd: user.password,
        name: user.name,
        token,
        balance,
        id: user._id,
      },
    };
  }
};

const logoutUser = async (id) => {
  await User.findByIdAndUpdate(id, { token: null });
  return { code: 204, message: "" };
};

const currentUser = async (id) => {
  const user = await User.findById(id);
  const { email, balance } = user;
  if (!user) {
    return { code: 401, message: "Not authorized1" };
  } else {
    return { code: 200, message: { email, id, balance } };
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
const setBalance = async (owner) => {
  const { message } = await getAllTransactions(owner);

  let income = 0;
  let expense = 0;
  let balance = 0;
  message.forEach(function (item) {
    item.type === "+"
      ? (income = income + Number(item.amount))
      : (expense = expense + Number(item.amount));
  });
  balance = income - expense;
  return { balance, income, expense };
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
