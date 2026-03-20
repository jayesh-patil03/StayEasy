const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../util/wrapAsync")
const Review = require("../models/review");
const Listing = require("../models/listing");
const { validateReview, isLoggedIn, isReviewAuthor, isTenantRole } = require("../middleware");

const reviewController = require("../controllers/reviews");


// post review route

router.post("/", isLoggedIn, isTenantRole, validateReview, wrapAsync(reviewController.createReview));

// delete review route
router.delete("/:reviewId", isLoggedIn, isTenantRole, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;
