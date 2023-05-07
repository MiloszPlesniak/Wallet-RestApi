const router = require("express").Router();

const usersRouter = require("./users");
const transactionsRouter = require("./transactions");

router.use("/api/users", usersRouter);
router.use("/api/users", transactionsRouter);

module.exports = router;
