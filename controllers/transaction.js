// const { getUserById } = require("../controllers/users.js");

const {
  Transaction,
  editTransactionValidate,
  addTransactionValidate,
  sortTransactionsValidate,
} = require("../models/transaction.js");
const category = require("../helpers/category.js");

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

const getAllTransactions = async (owner) => {
  const allTransaction = await Transaction.find({ owner });
  // if (allTransaction.length === 0) {
  //   return { code: 200, message: "You haven't added any transaction yet" };
  // }
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
  const { category, type, date, comment, amount } = transactionData;
  try {
    const transaction = new Transaction({
      category,
      type,
      date,
      comment: comment ? comment : "-",
      amount,
      owner: user.id,
    });
    transaction.save();

    return {
      code: 201,
      message: {
        transaction,
        balanceAfter:
          type === "-" ? user.balance - amount : user.balance + amount,
      },
    };
  } catch (error) {
    return { code: 500, message: error };
  }
};

// const updateTransaction = ;

const removeTransaction = async (user, transactionId) => {
  const transaction = await getTransactionById(transactionId);
  // const owner = await getUserById(transaction.id);
  if (!transaction) {
    return { code: 404, message: "Not found!" };
  }
  // if (owner.id !== user.id) {
  //   return { code: 400, message: "You are not the owner of this contact" };
  // }

  await Transaction.findOneAndDelate({ id });
  return { code: 200, message: transactionId };
};

const updateTransaction = async (user, data, transactionId) => {
  const transaction = await getTransactionById(transactionId);
  // const owner = await getUserById(transaction.id);
  if (!transaction) {
    return { code: 404, message: "Not found!" };
  }
  // if (owner.id !== user.id) {
  //   return { code: 400, message: "You are not the owner of this contact" };
  // }
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

const sortTransactionOfPeriot = async (user, periot) => {
  const { error } = sortTransactionsValidate.validate(periot);
  if (error) return { code: 400, message: error.details[0].message };
  const { message } = await getAllTransactions(user.id);
  if (message.length === 0) {
    return { code: 200, message: "You haven't added any transaction yet" };
  }
  const { month, year } = periot;
  const dateStart = new Date(year, month - 1).getTime();
  const dataEnd = new Date(year, month).getTime();

  const sortedTraactions = message.filter(
    (item) => dateStart <= item.date && item.date <= dataEnd
  );
  console.log(sortedTraactions);
  const segCat = await segregatedTransactions(sortedTraactions);

  return { code: 200, message: segCat };
};

const segregatedTransactions = async (transaction) => {
  const editedCategory = category;
  editedCategory.map((cat) => {
    transaction.forEach((trans) => {
      if (trans.category === cat.name) {
        cat.amount = cat.amount + trans.amount;
      }
    });
  });
  return editedCategory;
};

module.exports = {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  removeTransaction,
  updateTransaction,
  sortTransactionOfPeriot,
};
