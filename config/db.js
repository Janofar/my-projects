const mongoose = require('mongoose');
const { createDefaultUsers } = require('../utils/helpers');

const User = require("../models/User");
require('dotenv').config();

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("MongoDB URI is undefined. Please check .env configuration.");
    return;
  }

  try {
    await mongoose.connect(mongoUri).then(() => {
      console.log("MongoDB connected");
      createDefaultUsers()
    });

  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
