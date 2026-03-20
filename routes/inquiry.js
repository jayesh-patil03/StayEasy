const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const { isLoggedIn, isTenantRole, validateInquiry } = require("../middleware");
const inquiryController = require("../controllers/inquiries");

router.post("/:listingId", isLoggedIn, isTenantRole, validateInquiry, wrapAsync(inquiryController.createInquiry));

module.exports = router;
