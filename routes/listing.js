const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../util/ExpressError");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner} = require("../middleware.js")

// listing validate function
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

// listing route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings }); // must enter correct path. ( dont use / before listings )
  })
);

// new route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new.ejs");
});

// show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    const { id } = req.params; // curly brace is imp to retrive id.
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if (!listing) {
      req.flash("error", "Listing You Requested For Does Not Found !");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  })
);

// create route
router.post(
  "/", isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    // let { title, description, image, price , location, country } = req.body; (ye bhi use kr sakte hai but for better organization i use listing as parent object)
    // let listing = req.body.listing;  ( this is use to retrive all the fields from user input )
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
  })
);

// Edit route
router.get(
  "/:id/edit", isLoggedIn, isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//Upadte route
router.put(
  "/:id", isLoggedIn, isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id", isLoggedIn, isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
  })
);

module.exports = router;
