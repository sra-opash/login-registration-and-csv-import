'use strict'
module.exports = (app) => {
  const router = require("express").Router(); 
  const user = require("../routes/user.route");
  const contact = require("../routes/contact.route");

  router.use("/user",user)
  router.use("/contact",contact)
  app.use("/", router);
};
