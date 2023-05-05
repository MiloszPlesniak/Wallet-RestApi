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
  data: {
    type: Date,
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
});

const Transaction = mongoose.model("Transactions", transaction);

const addTransactionSchema = Joi.object({
  category: Joi.string().alphanum().required(),
  type: Joi.string().valid("+", "-").required(),
  data: Joi.date().required(),
  comment: Joi.string().alphanum().max(25),
  amount: Joi.number().required(),
});
const editTransactionSchema = Joi.object({
  category: Joi.string().alphanum(),
  type: Joi.string().valid("+", "-"),
  data: Joi.date(),
  comment: Joi.string().alphanum().max(25),
  amount: Joi.string(),
}).or("category", "type", "data", "comment", "amount");

module.exports = {
  Transaction,
  editTransactionSchema,
  addTransactionSchema,
};
