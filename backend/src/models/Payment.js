const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    billingMonth: {
      type: Date,
      required: [true, "Billing month is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    amountDue: {
      type: Number,
      required: [true, "Amount due is required"],
      min: [0, "Amount due cannot be negative"],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: [0, "Amount paid cannot be negative"],
    },
    balance: {
      type: Number,
      default: 0,
      min: [0, "Balance cannot be negative"],
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue"],
      default: "pending",
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank-transfer", "mpesa", "card", "other"],
      default: "mpesa",
    },
    transactionReference: {
      type: String,
      default: "",
      trim: true,
      maxlength: [120, "Transaction reference cannot exceed 120 characters"],
    },
    notes: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

paymentSchema.index({ property: 1, tenant: 1, billingMonth: 1 }, { unique: true });

paymentSchema.pre("validate", function (next) {
  this.balance = Math.max(this.amountDue - this.amountPaid, 0);

  if (this.balance === 0 && this.amountPaid > 0) {
    this.status = "paid";
  } else if (this.amountPaid > 0 && this.amountPaid < this.amountDue) {
    this.status = this.dueDate < new Date() ? "overdue" : "partial";
  } else if (this.amountPaid === 0) {
    this.status = this.dueDate < new Date() ? "overdue" : "pending";
  }

  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
