const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const Review = require("../models/review.js");
const Wishlist = require("../models/wishlist.js");
const Inquiry = require("../models/inquiry.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("connected DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const roomTypes = ["PG", "1BHK", "2BHK", "Shared"];
const genderPreferences = ["Male", "Female", "Any"];
const amenityCombos = [
  ["WiFi", "Kitchen"],
  ["WiFi", "AC"],
  ["WiFi", "Parking"],
  ["WiFi", "AC", "Kitchen"],
];

const initDB = async () => {
  await Review.deleteMany({});
  await Inquiry.deleteMany({});
  await Wishlist.deleteMany({});
  await Listing.deleteMany({});
  await User.deleteMany({});

  const owner = await User.register(
    new User({
      username: "owner_demo",
      email: "owner@roomease.com",
      role: "owner",
    }),
    "owner123"
  );

  await User.register(
    new User({
      username: "tenant_demo",
      email: "tenant@roomease.com",
      role: "tenant",
    }),
    "tenant123"
  );

  const listings = initData.data.map((obj, index) => ({
    ...obj,
    owner: owner._id,
    rent: obj.price,
    deposit: Math.round(obj.price * 1.5),
    roomType: roomTypes[index % roomTypes.length],
    furnished: index % 2 === 0,
    genderPreference: genderPreferences[index % genderPreferences.length],
    amenities: amenityCombos[index % amenityCombos.length],
    available: index % 5 !== 0,
  }));

  await Listing.insertMany(listings);
  console.log("RoomEase sample data inserted");
  console.log("Owner login: owner_demo / owner123");
  console.log("Tenant login: tenant_demo / tenant123");
};

initDB();
