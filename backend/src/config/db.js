const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully");
  } catch (error) {
    if (
      error.code === "ECONNREFUSED" &&
      typeof error.message === "string" &&
      error.message.includes("querySrv")
    ) {
      error.message =
        `${error.message}\n` +
        "SRV DNS lookup failed for the Atlas hostname. " +
        "Use a direct mongodb:// host list or a local MongoDB URI for development.";
    } else if (
      typeof error.message === "string" &&
      error.message.includes("IP that isn't whitelisted")
    ) {
      error.message =
        `${error.message}\n` +
        "Add this machine's public IP to MongoDB Atlas Network Access, " +
        "or temporarily allow 0.0.0.0/0 for development.";
    }

    throw error;
  }
};

module.exports = connectDB;
