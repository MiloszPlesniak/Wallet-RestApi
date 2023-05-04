const mongoose = require("mongoose");
// bcrypt do hashowania haseł
const bcrypt = require("bcrypt");
const Joi = require("joi");
// grawatar jest do default avatar
const gravatar = require("gravatar");
const Schema = mongoose.Schema;

const users = new Schema({});

const User = mongoose.model("user", users);

;


module.exports = {};
