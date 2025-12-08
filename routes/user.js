const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users");

// signup route
router.route("/signup")
.get( userController.renderSignupForm)
.post( wrapAsync(userController.signup));


// login routes

router.route("/login")
.get( userController.renderLoginForm)
// POST route to handle login form submission
.post( 
  // This is the middleware that runs first
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login', 
    failureFlash: true,       
  }),
  // This function only runs if authentication was successful
  userController.login
);


// logout 
router.get("/logout", userController.logout);

module.exports = router;