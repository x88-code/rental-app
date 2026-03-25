const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const sendTokenResponse = require("../utils/sendTokenResponse");

const register = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, role, nationalId } =
    req.body;

  const existingUser = await User.findOne({
    $or: [{ email: email.toLowerCase() }, { phone }],
  });

  if (existingUser) {
    throw new AppError("A user with this email or phone already exists.", 409);
  }

  const user = await User.create({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    password,
    role,
    nationalId: nationalId?.trim() || "",
  });

  return sendTokenResponse(user, 201, res, "User registered successfully.");
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  if (!user.isActive) {
    throw new AppError("Your account has been deactivated.", 403);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  user.lastLoginAt = new Date();
  await user.save();

  return sendTokenResponse(user, 200, res, "Login successful.");
});

const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user.toSafeObject(),
    },
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "phone",
    "avatar",
    "nationalId",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      req.user[field] =
        typeof req.body[field] === "string" ? req.body[field].trim() : req.body[field];
    }
  });

  await req.user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: {
      user: req.user.toSafeObject(),
    },
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = newPassword;
  await user.save();

  return sendTokenResponse(
    user,
    200,
    res,
    "Password changed successfully."
  );
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
