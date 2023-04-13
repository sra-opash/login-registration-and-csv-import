"use strict";
const mongoose = require("mongoose");

const schema = mongoose.Schema({
  name: { type: String },
  mobileNo: {type: String,unique:true},
  email: {type: String, unique: true},
  address: { type: String },
});

schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  module.exports = mongoose.model("contacts",schema)