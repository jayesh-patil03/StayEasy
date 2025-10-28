const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
})


router.post("/signup", wrapAsync(async(req, res) => {
    try{
        let{username, email, password} = req.body;
    const newUser = new User ({email, username});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "welcome to StayEasy !");
    res.redirect("/listings");
    })
    
    }
    catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }

}));


// login routes

router.get("/login", (req, res)=>{
    
    res.render("users/login.ejs");
});

// POST route to handle login form submission
router.post('/login', 
  // This is the middleware that runs first
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login', // Redirect back to the login page if there's an error
    failureFlash: true,        // Enable flash messages to display the error
  }),
  // This function only runs if authentication was successful
  (req, res) => {
    req.flash('success', 'Welcome back!');
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl); // Redirect to a protected page
  }
);


// logout 
router.get("/logout", (req,res,next)=>{
  req.logOut((err)=>{
    if(err){
      return next(err);
    }
    req.flash("success", "You are logged out !");
    res.redirect("/listings");
  })
})

module.exports = router;