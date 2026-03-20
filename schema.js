const Joi = require("joi");

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    country: Joi.string().required(),
    rent: Joi.number().required().min(0),
    deposit: Joi.number().required().min(0),
    roomType: Joi.string().valid("PG", "1BHK", "2BHK", "Shared").required(),
    furnished: Joi.boolean().optional(),
    genderPreference: Joi.string().valid("Male", "Female", "Any").required(),
    amenities: Joi.alternatives().try(
      Joi.array().items(Joi.string().valid("WiFi", "AC", "Kitchen", "Parking")),
      Joi.string().valid("WiFi", "AC", "Kitchen", "Parking")
    ).optional(),
    available: Joi.boolean().optional(),
    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null),
    }).optional(),
  }).required(),
});

const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required(),
  }).required(),
});

const inquirySchema = Joi.object({
  inquiry: Joi.object({
    message: Joi.string().trim().min(10).required(),
  }).required(),
});

module.exports = { listingSchema, reviewSchema, inquirySchema };
