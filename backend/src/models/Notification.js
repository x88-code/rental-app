const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: [
        "booking_created",
        "booking_approved",
        "booking_rejected",
        "booking_allocated",
        "booking_cancelled",
        "payment_reminder",
        "payment_received",
      ],
      required: [true, "Notification type is required"],
    },
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      maxlength: [120, "Notification title cannot exceed 120 characters"],
    },
    message: {
      type: String,
      required: [true, "Notification message is required"],
      trim: true,
      maxlength: [500, "Notification message cannot exceed 500 characters"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Booking",
        default: null,
      },
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
        default: null,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Notification", notificationSchema);
