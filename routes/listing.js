const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const { isLoggedIn, isOwner, isOwnerRole, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isOwnerRole,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, isOwnerRole, listingController.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwnerRole,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwnerRole,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

router.get("/:id/edit", isLoggedIn, isOwnerRole, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;
