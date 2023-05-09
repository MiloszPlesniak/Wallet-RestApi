// const fs = require("fs/promises");
const { getUserById } = require("../controllers/users.js");
// const { v4: uuidv4 } = require("uuid");
const {
  Transaction,
  editTransactionValidate,
  addTransactionValidate,
  sortTraactionsValidate,
} = require("../models/transaction.js");

// const transactionCategoryList = [
//   { MainExpenses: 0 },
//   { Products: 0 },
//   { Car: 0 },
//   { SelfCare: 0 },
//   { ChildCare: 0 },
//   { HouseholdProducts: 0 },
//   { Education: 0 },
//   { Leisure: 0 },
// ];

const getAllTransactions = async (ownerId) => {
  const allTransaction = await Transaction.find(ownerId);
  if (allTransaction.length === 0) {
    return { code: 200, message: "You haven't added any transaction yet" };
  }
  return { code: 200, message: allTransaction };
};

const getTransactionById = async (id) => {
  const transaction = Transaction.findById(id);
  if (!transaction) {
    return { code: 404, message: "Not found!" };
  }
  return transaction;
};

const addTransaction = async (transactionData, user) => {
  const { error } = addTransactionValidate.validate(transactionData);
  if (error) return { code: 400, message: error.details[0].message };
  const { category, type, data, comment, amount } = transactionData;
  try {
    const transaction = new Transaction({
      category,
      type,
      data,
      comment: comment ? comment : "-",
      amount,
      owner: user._id,
    });
    transaction.save();
    return { code: 201, message: transaction };
  } catch (error) {
    return { code: 500, message: error };
  }
};

// const updateTransaction = ;

const removeTransaction = async (user, transactionId) => {
  const transaction = await getTransactionById(transactionId);
  const owner = await getUserById(transaction._id);
  if (!transaction) {
    return { code: 404, message: "Not found!" };
  }
  if (owner._id !== user._id) {
    return { code: 400, message: "You are not the owner of this contact" };
  }

  await Transaction.findOneAndDelate({ id });
  return { code: 200, message: "Transaction removed" };
};

const updateTransaction = async (user, data, transactionId) => {
  const transaction = await getTransactionById(transactionId);
  const owner = await getUserById(transaction._id);
  if (!transaction) {
    return { code: 404, message: "Not found!" };
  }
  if (owner._id !== user._id) {
    return { code: 400, message: "You are not the owner of this contact" };
  }
  const { error } = editTransactionValidate.validate(data);
  if (error) return { code: 400, message: error.details[0].message };

  try {
    const changeTransaction = await Transaction.findByIdAndUpdate(
      transactionId,
      data
    );
    return { code: 200, message: changeTransaction };
  } catch (error) {
    return { code: 500, message: error };
  }
};

const sortTransactionOfPeriot = async (user, data) => {
  const { error } = await sortTraactionsValidate.validate(data);
  if (error) return { code: 400, message: error.details[0].message };
  const transactions = await getAllTransactions(user._id);
  if (transactions.length === 0) {
    return { code: 200, message: "You haven't added any transaction yet" };
  }
  const sortedTraactions = transactions.filter(
    (item) => data.start <= item.data && item.data <= data.end
  );
  return { code: 200, message: sortedTraactions };
};

// const sortTransactionOfCategory = async (user, data) => {
//   transactionCategoryList.map((item)=>{})
// };
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

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  removeTransaction,
  updateTransaction,
  sortTransactionOfPeriot,
};
