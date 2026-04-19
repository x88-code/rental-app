const dotenv = require("dotenv");

dotenv.config();

const app = require("./src/app");
const connectDB = require("./src/config/db");
const ensureDevUser = require("./src/utils/ensureDevUser");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await ensureDevUser();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
