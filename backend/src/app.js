const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

const sanitizeRequest = (req, res, next) => {
  ["body", "params", "headers", "query"].forEach((key) => {
    if (req[key]) {
      mongoSanitize.sanitize(req[key]);
    }
  });

  next();
};

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(sanitizeRequest);
app.use(cookieParser());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Rental House Management backend is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/properties", propertyRoutes);

app.use((req, res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
