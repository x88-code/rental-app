const express = require("express");

const authController = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

const emailPattern = /^\S+@\S+\.\S+$/;

router.post(
  "/register",
  validate({
    firstName: { required: true, type: "string", minLength: 2, maxLength: 50 },
    lastName: { required: true, type: "string", minLength: 2, maxLength: 50 },
    email: {
      required: true,
      type: "string",
      pattern: emailPattern,
      message: "email must be a valid email address",
    },
    phone: { required: true, type: "string", minLength: 7, maxLength: 20 },
    password: { required: true, type: "string", minLength: 8, maxLength: 100 },
    role: {
      required: true,
      type: "string",
      enum: ["tenant", "landlord", "admin"],
    },
    nationalId: { type: "string", maxLength: 50 },
  }),
  authController.register
);

router.post(
  "/login",
  validate({
    email: {
      required: true,
      type: "string",
      pattern: emailPattern,
      message: "email must be a valid email address",
    },
    password: { required: true, type: "string", minLength: 8, maxLength: 100 },
  }),
  authController.login
);

router.get(
  "/me",
  protect,
  authorize("tenant", "landlord", "admin"),
  authController.getProfile
);

router.patch(
  "/me",
  protect,
  authorize("tenant", "landlord", "admin"),
  validate({
    firstName: { type: "string", minLength: 2, maxLength: 50 },
    lastName: { type: "string", minLength: 2, maxLength: 50 },
    phone: { type: "string", minLength: 7, maxLength: 20 },
    avatar: { type: "string", maxLength: 500 },
    nationalId: { type: "string", maxLength: 50 },
  }),
  authController.updateProfile
);

router.patch(
  "/change-password",
  protect,
  authorize("tenant", "landlord", "admin"),
  validate({
    currentPassword: {
      required: true,
      type: "string",
      minLength: 8,
      maxLength: 100,
    },
    newPassword: {
      required: true,
      type: "string",
      minLength: 8,
      maxLength: 100,
      custom: (value, body) =>
        value !== body.currentPassword ||
        "newPassword must be different from currentPassword",
    },
  }),
  authController.changePassword
);

module.exports = router;
