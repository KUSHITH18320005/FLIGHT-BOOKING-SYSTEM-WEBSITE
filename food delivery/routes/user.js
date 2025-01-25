const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utlis/wrapAsync.js"); // Corrected path
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js"); // Corrected path

router
.route("/signup")
.get(userController.renderSignUpForm)
.post(wrapAsync(userController.signup));

router 
.route("/login")
.get(userController.renderLoginForm)
.post(
     saveRedirectUrl,
     passport.authenticate("local", {
    failureRedirect: '/login',
    failureFlash: true
}), 
    userController.login,
);

// Logout
router.get("/logout", userController.logout);
module.exports = router;
