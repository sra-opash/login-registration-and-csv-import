"use strict";
const router = require("express").Router();
const contact = require("../controllers/contact.controller");
const imageUpload = require("../middleware/imageUpload");

router.post("/get-contact", contact.searchContact);
router.post("/add-csv", imageUpload,contact.addContactByCsv);
router.post("/add-contact", imageUpload,contact.addContact);
router.get("/get", imageUpload,contact.searchConotact);


module.exports = router;