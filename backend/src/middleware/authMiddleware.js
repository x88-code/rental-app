const jwt = require("jsonwebtoken");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized. Please log in to continue.", 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError("JWT_SECRET is not configured.", 500);
  }

  const decoded = jwt.verify(token, jwtSecret);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new AppError("The user linked to this token no longer exists.", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Authentication is required first.", 401));
  }

  if (!roles.includes(req.user.role)) {
    return next(
      new AppError("You do not have permission to access this resource.", 403)
    );
  }

  next();
};

module.exports = {
  protect,
  authorize,
};
