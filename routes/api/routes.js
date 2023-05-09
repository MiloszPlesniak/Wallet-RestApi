const router = require("express").Router();

const usersRouter = require("./users");
const transactionsRouter = require("./transactions");

router.use("/api/users", usersRouter);
router.use("/api/transactions", transactionsRouter);

module.exports = router;
