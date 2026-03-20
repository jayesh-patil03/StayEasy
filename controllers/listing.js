const Listing = require("../models/listing.js");
const Wishlist = require("../models/wishlist.js");
const Inquiry = require("../models/inquiry.js");

const amenityOptions = ["WiFi", "AC", "Kitchen", "Parking"];

const normalizeAmenities = (amenities) => {
  if (!amenities) return [];
  return Array.isArray(amenities) ? amenities : [amenities];
};

const normalizeListingInput = (payload = {}) => {
  const normalized = { ...payload };
  normalized.rent = Number(payload.rent || 0);
  normalized.price = normalized.rent;
  normalized.deposit = Number(payload.deposit || 0);
  normalized.furnished = payload.furnished === true || payload.furnished === "true" || payload.furnished === "on";
  normalized.available = payload.available === undefined
    ? false
    : payload.available === true || payload.available === "true" || payload.available === "on";
  normalized.amenities = normalizeAmenities(payload.amenities).filter((item) =>
    amenityOptions.includes(item)
  );
  return normalized;
};

const buildFilters = (query) => {
  const mongoQuery = {};
  const activeFilters = {
    city: query.city?.trim() || "",
    minRent: query.minRent || "",
    maxRent: query.maxRent || "",
    roomType: query.roomType || "",
    furnished: query.furnished || "",
    genderPreference: query.genderPreference || "",
    available: query.available || "",
  };

  if (activeFilters.city) {
    mongoQuery.location = { $regex: activeFilters.city, $options: "i" };
  }

  const rentFilters = {};
  if (activeFilters.minRent) rentFilters.$gte = Number(activeFilters.minRent);
  if (activeFilters.maxRent) rentFilters.$lte = Number(activeFilters.maxRent);
  if (Object.keys(rentFilters).length) {
    mongoQuery.$or = [
      { rent: rentFilters },
      { rent: { $exists: false }, price: rentFilters },
    ];
  }

  if (activeFilters.roomType) {
    mongoQuery.roomType = activeFilters.roomType;
  }

  if (activeFilters.furnished === "true") {
    mongoQuery.furnished = true;
  }

  if (activeFilters.genderPreference) {
    mongoQuery.genderPreference = activeFilters.genderPreference;
  }

  if (activeFilters.available === "true") {
    mongoQuery.available = true;
  }

  return { mongoQuery, activeFilters };
};

const getSavedListingIds = async (userId) => {
  if (!userId) return [];
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) return [];
  return wishlist.listings.map((listingId) => listingId.toString());
};

module.exports.index = async (req, res) => {
  const { mongoQuery, activeFilters } = buildFilters(req.query);
  const allListings = await Listing.find(mongoQuery).populate("owner");
  const savedListingIds = await getSavedListingIds(req.user?._id);

  res.render("listings/index", {
    allListings,
    filters: activeFilters,
    savedListingIds,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs", { amenityOptions });
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");

  if (!listing) {
    req.flash("error", "The room you requested was not found.");
    return res.redirect("/listings");
  }

  const wishlist = req.user ? await Wishlist.findOne({ user: req.user._id }) : null;
  const isSaved = wishlist
    ? wishlist.listings.some((listingId) => listingId.equals(listing._id))
    : false;

  const inquiries = await Inquiry.find({ listingId: listing._id })
    .populate("tenantId")
    .sort({ createdAt: -1 });

  res.render("listings/show.ejs", {
    listing,
    isSaved,
    inquiries,
  });
};

module.exports.createListing = async (req, res) => {
  const url = req.file.path;
  const filename = req.file.filename;
  const payload = normalizeListingInput(req.body.listing);
  const newListing = new Listing(payload);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "Room listed successfully.");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "The room you want to edit was not found.");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing, amenityOptions });
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  const payload = normalizeListingInput(req.body.listing);
  const listing = await Listing.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (typeof req.file !== "undefined") {
    const url = req.file.path;
    const filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Room details updated successfully.");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Room listing removed successfully.");
  res.redirect("/listings");
};
