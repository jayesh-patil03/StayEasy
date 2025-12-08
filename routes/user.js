const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users");
const { saveRedirectUrl } = require("../middleware.js");

// signup
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.signup);   // <- no wrapAsync needed

// login
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// logout
router.get("/logout", userController.logout);

module.exports = router;
