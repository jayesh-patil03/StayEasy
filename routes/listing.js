const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage })


router.route("/")  // all below req. goes to same route i.e "/"
.get(
  wrapAsync(listingController.index)  // listing route
)
.post(
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)   // create route
);


// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(
  wrapAsync(listingController.showListing) // show route
)
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing)  //Upadte route
)
.delete(
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing) // delete route
);

// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;
