const Inquiry = require("../models/inquiry");
const Listing = require("../models/listing");

module.exports.createInquiry = async (req, res) => {
  const { listingId } = req.params;
  const listing = await Listing.findById(listingId);

  if (!listing) {
    req.flash("error", "The room you are trying to contact about was not found.");
    return res.redirect("/listings");
  }

  await Inquiry.create({
    tenantId: req.user._id,
    listingId,
    message: req.body.inquiry.message,
  });

  req.flash("success", "Your message has been sent to the owner.");
  res.redirect(`/listings/${listingId}`);
};
