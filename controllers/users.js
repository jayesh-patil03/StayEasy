const User = require("../models/user");

// =================== SIGNUP ===================

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    // log the user in after successful registration
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err); // <-- next is definitely available here
      }

      req.flash("success", "Welcome to StayEasy!");
      return res.redirect("/listings");
    });
  } catch (err) {
    // any error from User.register (e.g. duplicate username)
    req.flash("error", err.message);
    return res.redirect("/signup");
  }
};

// =================== LOGIN ===================

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// =================== LOGOUT ===================

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings");
  });
};