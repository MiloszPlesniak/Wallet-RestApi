const Joi = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const transaction = new Schema({
  category: {
    type: String,
    required: [true, "Set category for transaction"],
  },
  type: {
    type: String,
    required: [true, "Set type for transaction"],
    enum: ["-", "+"],
  },
  date: {
    type: Number,
    required: [true, "Set data for transaction"],
  },
  comment: {
    type: String,
    default: "-",
  },
  amount: {
    type: Number,
    required: [true, "Set amount for transaction"],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Transaction = mongoose.model("Transactions", transaction);

const addTransactionSchema = Joi.object({
  category: Joi.string(),
  type: Joi.string().valid("+", "-").required(),
  date: Joi.number().required(),
  comment: Joi.string().min(0).max(25),
  amount: Joi.string().required(),
  owner: Joi.string().required(),
});
const editTransactionSchema = Joi.object({
  category: Joi.string().alphanum(),
  type: Joi.string().valid("+", "-"),
  dat: Joi.date(),
  comment: Joi.string().alphanum().max(25),
  amount: Joi.string(),
}).or("category", "type", "data", "comment", "amount");
const sortTransactionsSchema = Joi.object({
  year: Joi.number(),
  month: Joi.number(),
});
module.exports = {
  Transaction,
  editTransactionValidate: editTransactionSchema,
  addTransactionValidate: addTransactionSchema,
  sortTransactionsValidate: sortTransactionsSchema,
};
