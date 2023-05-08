const express = require("express");
const router = express.Router();

const auth = require("../../auth/auth");

const { addTransaction, getAllTransactions, getTransactionById, removeTransaction} = require("../../controllers/transaction");

// Create new transaction for logged in user
router.post("/transactions", auth, async (req, res) => {
    try {
        const { code, message } = await addTransaction(req.body);
        res.status(code).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all transactions for logged in user
router.get("/transactions", auth, async (req, res) => {
    try {
        const { code, message } = await getAllTransactions(req.body);
        res.status(code).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get one transaction for logged in user
router.get("/transactions/{transactionId}", auth, async (req, res) => {
    try {
        const { code, message } = await getTransactionById(req.body.id);
        res.status(code).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Update transactions
router.patch("/transactions/{transactionId}", auth, async (req, res) => {
    try {
        // const { code, message } = await updateTransaction(req.body.id);
        // res.status(code).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Remove transaction
router.delete("/transactions/{transactionId}", auth, async (req, res) => {
    try {
        const { code, message } = await removeTransaction(req.body.id);
        res.status(code).json(message);
    } catch (error) {
        res.status(500).json(error);
    }
});

// Get all transactions for logged in user by categories
// router.get("/transaction-categories", auth, async (req, res) => {
//     try {
//         const { code, message } = await getCategories(req.body);
//         res.status(code).json(message);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });

// router.get("/transaction-statistic", auth, async (req, res) => {
//     try {
//         const { code, message } = await getStatistic(req.body);
//         res.status(code).json(message);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// });


module.exports = router;
