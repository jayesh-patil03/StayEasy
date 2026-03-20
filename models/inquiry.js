const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inquirySchema = new Schema({
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  listingId: {
    type: Schema.Types.ObjectId,
    ref: "Listing",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Inquiry", inquirySchema);
