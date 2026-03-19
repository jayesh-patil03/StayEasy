const mongoose = require("mongoose");
const app = require("../app");

const dbUrl =
  process.env.NODE_ENV === "production"
    ? process.env.ATLASDB_URL
    : "mongodb://127.0.0.1:27017/wonderlust";

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) return cachedConnection;

  cachedConnection = mongoose.connect(dbUrl, {
    bufferCommands: false,
  });

  return cachedConnection;
}

module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error("DB ERROR:", err);
    return res.status(500).send("Database connection failed");
  }
};
