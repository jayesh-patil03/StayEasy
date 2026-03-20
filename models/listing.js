const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Inquiry = require("./inquiry.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    default: 0,
  },
  rent: {
    type: Number,
    default: 0,
  },
  deposit: {
    type: Number,
    default: 0,
  },
  roomType: {
    type: String,
    enum: ["PG", "1BHK", "2BHK", "Shared"],
    default: "PG",
  },
  furnished: {
    type: Boolean,
    default: false,
  },
  genderPreference: {
    type: String,
    enum: ["Male", "Female", "Any"],
    default: "Any",
  },
  amenities: {
    type: [String],
    default: [],
  },
  available: {
    type: Boolean,
    default: true,
  },
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.virtual("displayRent").get(function () {
  return this.rent || this.price || 0;
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    await Inquiry.deleteMany({ listingId: listing._id });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
