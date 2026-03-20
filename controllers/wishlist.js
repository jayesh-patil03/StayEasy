const Wishlist = require("../models/wishlist");

async function getOrCreateWishlist(userId) {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, listings: [] });
  }
  return wishlist;
}

module.exports.index = async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("listings");
  res.render("wishlist/index.ejs", {
    listings: wishlist ? wishlist.listings : [],
  });
};

module.exports.addToWishlist = async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const listingId = req.params.id;

  if (!wishlist.listings.some((savedId) => savedId.equals(listingId))) {
    wishlist.listings.push(listingId);
    await wishlist.save();
  }

  req.flash("success", "Room saved to your wishlist.");
  res.redirect(req.get("referer") || "/listings");
};

module.exports.removeFromWishlist = async (req, res) => {
  const wishlist = await getOrCreateWishlist(req.user._id);
  const listingId = req.params.id;
  wishlist.listings = wishlist.listings.filter((savedId) => !savedId.equals(listingId));
  await wishlist.save();

  req.flash("success", "Room removed from your wishlist.");
  res.redirect(req.get("referer") || "/wishlist");
};
