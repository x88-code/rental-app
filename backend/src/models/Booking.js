const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property is required"],
    },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Tenant is required"],
    },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord is required"],
    },
    requestedMoveInDate: {
      type: Date,
      required: [true, "Requested move-in date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "allocated"],
      default: "pending",
    },
    allocatedUnitLabel: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
    landlordResponseMessage: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Response message cannot exceed 1000 characters"],
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    allocatedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ property: 1, tenant: 1, status: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
