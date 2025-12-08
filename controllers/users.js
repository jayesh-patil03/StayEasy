const User = require("../models/user");

module.exports.renderSignupForm = (req, res) =>{
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);               // <– next is now defined
      }

      req.flash("success", "Welcome to StayEasy!");
      return res.redirect("/listings");  // <– return added to prevent fallthrough
    });

  } catch (err) {
    req.flash("error", err.message);
    return res.redirect("/signup");      // <– return for safety
  }
};


module.exports.renderLoginForm = (req, res)=>{
    
    res.render("users/login.ejs");
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // Redirect to a protected page
  }

  module.exports.logout = (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out !");
    res.redirect("/listings");
  })
}