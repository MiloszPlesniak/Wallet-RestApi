const fs = require("fs/promises");

const { v4: uuidv4 } = require("uuid");
const { Transaction, editTransactionSchema, addTransactionSchema } = require("../models/transaction.js");

const getAllTransactions = async (transactionData) => {
    const allTransaction = await Transaction.find();
    if (!allTransaction) {
        return {code: 404, message: "You have not made any transaction yet"}
    } 
    return { code: 200, message: allTransaction };
};

const addTransaction = async (transactionData) => {
    const newTransaction = await Transaction.create({ ...transactionData });
    if (!newTransaction) {
        return { code: 404, message: "Unable to add a new transaction" };
    }
    return { code: 201, message: newTransaction };
};

const getTransactionById = async (id) => {
    const transaction = Transaction.findById(id);
    if (!transaction ) {
        return { code: 404, message: "Not found!" };
    }
    return { code: 200, message: transaction };
}

// const updateTransaction = ;

const removeTransaction = async (id) => {
    const deleteTransaction = await Transaction.findOneAndDelate({ id });
    if (!deleteTransaction) {
        return { code: 404, message: "Not found!" };
    }
    return { code: 200, message: "Transaction removed" };
};

// const getCategories = async () => {
//     const data = await /// ścieżka do kategorii
//     if (!data) {
//         return { code: 404, message: "Categories not found" };
//     }
//     return { code: 200, message: "Successful operation" };
// };

// const getStatistic = async () => {
//     const data = await 
//     if (!data) {
//         return { code: 404, message: "Not found!" };
//     } 
//     return { code: 200, message: "" }
// }


module.exports = { addTransaction, getAllTransactions, getTransactionById, removeTransaction };
