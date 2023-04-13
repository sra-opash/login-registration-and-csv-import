'use strict'
const mongoose = require("mongoose");
const constants = require('../utils/constants');

const userSchema = mongoose.Schema({
  fName: { type: String, default: null },
  lName: { type: String, default: null },
  email: { type: String, unique: true },
  userName: {type : String, unique: true},
  password: { type: String },
  role: { type: String, enum: constants.user.roles, default: constants.roles.user },
  isMarkImportant: { type: Boolean, default: false}
});

userSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
module.exports = mongoose.model("users", userSchema);