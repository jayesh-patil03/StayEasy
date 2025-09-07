const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./util/wrapAsync")
const ExpressError = require("./util/ExpressError");
const { error } = require("console");
const listingSchema = require("./schema.js");

// database connection

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main()
  .then(() => {
    console.log("connected DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// path
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));  // to use static files present in layout folder.


// Routes

app.get("/", (req, res) => {
  res.send("hii, i am root");
});

// listing validate function
const validateListing = (req, res, next) =>{
   let {error} = listingSchema.validate(req.body);
   let errMsg = error.details.map((el)=> el.message).join(",");
  if(error){
    throw new ExpressError(400, errMsg);
  } else{
    next();
  }
}


// listing route
app.get("/listings", wrapAsync(async (req, res)=>{
  const allListings = await Listing.find({});
  res.render("listings/index", {allListings}); // must enter correct path. ( dont use / before listings )

}));

// new route
app.get("/listings/new", (req, res) =>{
  res.render("listings/new.ejs");
})

// show route
app.get("/listings/:id", wrapAsync(async (req, res) =>{
  const { id } = req.params;   // curly brace is imp to retrive id.
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", {listing});
}));

// create route
app.post("/listings", validateListing, wrapAsync( async (req, res) =>{
  // let { title, description, image, price , location, country } = req.body; (ye bhi use kr sakte hai but for better organization i use listing as parent object)
  // let listing = req.body.listing;  ( this is use to retrive all the fields from user input )
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
}));

// Edit route
app.get("/listings/:id/edit",validateListing, wrapAsync(async (req, res) =>{
  let {id} = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/edit.ejs", {listing});
}));

//Upadte route
app.put("/listings/:id", wrapAsync(async (req, res) =>{
  let {id} = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect(`/listings/${id}`)
}));

//delete route
app.delete("/listings/:id", wrapAsync(async(req, res) =>{
  let {id} = req.params;
  const deleteListing = await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));


// For invalid routes
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { message });
});


app.listen(8080, () => {
  console.log("server is started");
});
