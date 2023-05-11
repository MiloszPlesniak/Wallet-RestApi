const express = require("express");
const router = express.Router();

const auth = require("../../auth/auth");

const {
  addTransaction,
  getAllTransactions,
  removeTransaction,
  updateTransaction,
  sortTransactionOfPeriot,
  segregatedTransactions,
} = require("../../controllers/transaction");
const { setBalance } = require("../../controllers/users");

// Get all transactions for logged in user
router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.body.user;
    const { code, message } = await getAllTransactions(id);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Create new transaction for logged in user
router.post("/", auth, async (req, res) => {
  try {
    const { user, data } = req.body;
    const { code, message } = await addTransaction(data, user);
    await setBalance(user.id);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Remove transaction
router.delete("/:transactionId", auth, async (req, res) => {
  try {
    const { user } = req.body;
    const { transactionId } = req.params;
    const { code, message } = await removeTransaction(user, transactionId);
    await setBalance(user.id);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update transactions
router.patch("/:transactionId", auth, async (req, res) => {
  try {
    const { user, data } = req.body;
    const { transactionId } = req.params;
    const { code, message } = await updateTransaction(
      transactionId,
      user,
      data
    );
    await setBalance(user.id);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/periodicTransactions", auth, async (req, res) => {
  try {
    const { user, data } = req.body;
    const { code, message } = await sortTransactionOfPeriot(user, data);
    res.status(code).json(message);
  } catch (error) {
    res.status(500).json(error);
  }
});

// router.get("/balance", auth, async (req, res) => {
//   try {
//     const { user } = req.body;
//     const {code,message}= await calculate
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

module.exports = router;
