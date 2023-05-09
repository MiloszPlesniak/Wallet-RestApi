const express = require("express");
const router = express.Router();

const auth = require("../../auth/auth");

const {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  emailVerify,
  resendingTheEmail,
} = require("../../controllers/users");

router.post("/signup", async (req, res) => {
  try {
    const { code, message } = await registerUser(req.body);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { code, message } = await loginUser(req.body);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/logout", auth, async (req, res) => {
  try {
    const { code, message } = await logoutUser(req.body.user.id);
    res.status(code).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.get("/current", auth, async (req, res) => {
  try {
    const { code, message } = await currentUser(req.body.user.id);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/verify/:verificationToken", async (req, res) => {
  const { verificationToken } = req.params;
  try {
    const { message, code } = await emailVerify(verificationToken);
    res.status(code).json({ message });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { email } = req.body;
    const { code, message } = await resendingTheEmail(email);
    res.status(code).json({ message });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
