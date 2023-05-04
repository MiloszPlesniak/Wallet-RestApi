const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const auth = require("../../auth/auth");
const {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  setAvatar,
  emailVerify,
  resendingTheEmail,
  changeSub,
} = require("../../controllers/users");

const temporaryStore = path.join(process.cwd(), "/tmp");

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
    const { message, code } = await loginUser(req.body);
    res.status(code).json(message);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    const { code, message } = await logoutUser(req.body.user.id);
    res.status(code).json(message);
  } catch (error) {
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

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, temporaryStore);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 1048576,
  },
});

const avatarUpload = multer({ storage });

router.patch(
  "/avatars",
  avatarUpload.single("avatar"),
  auth,
  async (req, res) => {
    try {
      const { message, code } = await setAvatar(req.file, req.body.user);
      res.status(code).json({ avatarURL: message });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

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

router.patch("/", auth, async (req, res) => {
  try {
    const { data, user } = req.body;
    const { message, code } = await changeSub(user, data);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
