const express = require("express");
const router = express.Router();
const wrapAsync = require("../util/wrapAsync");
const { isLoggedIn, isTenantRole } = require("../middleware");
const wishlistController = require("../controllers/wishlist");

router.get("/", isLoggedIn, isTenantRole, wrapAsync(wishlistController.index));
router.post("/:id", isLoggedIn, isTenantRole, wrapAsync(wishlistController.addToWishlist));
router.delete("/:id", isLoggedIn, isTenantRole, wrapAsync(wishlistController.removeFromWishlist));

module.exports = router;
