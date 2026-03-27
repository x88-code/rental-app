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


app.listen(5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
