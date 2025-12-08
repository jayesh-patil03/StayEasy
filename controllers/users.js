const User = require("../models/user");

// SIGNUP 

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ email, username });

    // Create user in DB 
    const registeredUser = await User.register(newUser, password);

    
    req.login(registeredUser, (err) => {
      if (err) {
        console.error("Auto-login error after signup:", err);
        req.flash(
          "error",
          "Account created, but we couldn't log you in automatically. Please log in manually."
        );
        return res.redirect("/login");
      }

      // Auto-login success
      req.flash("success", "Welcome to StayEasy!");
      return res.redirect("/listings");
    });
  } catch (err) {
  
    console.error("Signup error:", err);
    req.flash("error", err.message || "Unable to sign you up");
    return res.redirect("/signup");
  }
};

// LOGIN 

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

// LOGOUT

module.exports.logout = (req, res, next) => {
  req.logOut((err) => {
    if (err) return next(err);
    req.flash("success", "You are logged out !");
    res.redirect("/listings");
  });
};
