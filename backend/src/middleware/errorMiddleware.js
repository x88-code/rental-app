const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof AppError)) {
    error = new AppError(error.message || "Internal server error", 500);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((item) => item.message)
      .join(". ");
    error = new AppError(message, 400);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    error = new AppError(`${field} already exists`, 409);
  }

  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid authentication token.", 401);
  }

  if (err.name === "TokenExpiredError") {
    error = new AppError("Authentication token expired. Please log in again.", 401);
  }

  res.status(error.statusCode).json({
    success: false,
    status: error.status,
    message: error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
