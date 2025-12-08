const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./util/ExpressError");


module.exports.isLoggedIn = (req, res, next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in to create listing !");
    return res.redirect("/login");
  }
  next();

}

module.exports.saveRedirectUrl =  (req, res, next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) =>{
   let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error", " You Dont Have permission To Make Changes");
      return res.redirect(`/listings/${id}`)
    }
    next();
};

// Listing validation function
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// review validation function
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// review delete validation 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);

    // FIX 1: Check if review exists before checking author
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    // FIX 2: Compare directly. 'review.author' is already an ID (not an object)
    // We remove the "._id" part from review.author
    if (!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You do not have permission to delete this review");
        return res.redirect(`/listings/${id}`);
    }

    next();
};