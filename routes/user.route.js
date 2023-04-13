"use strict";
const router = require("express").Router();
const user = require("../controllers/user.controller");
const auth = require("../middleware/auth");
const imageUpload = require("../middleware/imageUpload");

router.post("/login", user.loginUser);
router.post("/sign-up", user.registerUser);
router.post("/forgot-password", user.forgetPassword);

module.exports = router;