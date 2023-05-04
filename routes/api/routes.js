const router = require("express").Router();

const contactsRouter = require("./contacts");
const usersRouter = require("./users");

router.use("/api/contacts", contactsRouter);
router.use("/api/users", usersRouter);

module.exports = router;
