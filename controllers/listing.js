const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  const { city } = req.query;            // read ?city= from query string
  let allListings;
  let searchCity = "";

  if (city && city.trim() !== "") {
    searchCity = city.trim();
    allListings = await Listing.find({
      location: { $regex: searchCity, $options: "i" },
    });
  } else {
    allListings = await Listing.find({});
  }

  res.render("listings/index", { allListings, searchCity });
};


module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params; // curly brace is imp to retrive id.
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing You Requested For Does Not Found !");
      return res.redirect("/listings");
    }  
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing = async (req, res) => {
      // let { title, description, image, price , location, country } = req.body; (ye bhi use kr sakte hai but for better organization i use listing as parent object)
      // let listing = req.body.listing;  ( this is use to retrive all the fields from user input )
      let url = req.file.path;
      let filename = req.file.filename;
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url, filename};
      await newListing.save();
      req.flash("success", "New Listing Created !");
      res.redirect("/listings");
    }

    module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save()
    }
    
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
  }

  module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    const deleteListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
  }