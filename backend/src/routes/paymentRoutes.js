const express = require("express");

const paymentController = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get(
  "/",
  authorize("tenant", "landlord", "admin"),
  paymentController.getPayments
);

router.get(
  "/:id",
  authorize("tenant", "landlord", "admin"),
  paymentController.getPaymentById
);

router.post(
  "/",
  authorize("tenant", "landlord", "admin"),
  validate({
    propertyId: { required: true, type: "string", minLength: 12, maxLength: 50 },
    tenantId: { type: "string", minLength: 12, maxLength: 50 },
    billingMonth: {
      required: true,
      custom: (value) =>
        !Number.isNaN(new Date(value).getTime()) || "billingMonth must be a valid date",
    },
    dueDate: {
      custom: (value) =>
        value === undefined ||
        !Number.isNaN(new Date(value).getTime()) ||
        "dueDate must be a valid date",
    },
    amountDue: {
      custom: (value) =>
        value === undefined ||
        !Number.isNaN(Number(value)) ||
        "amountDue must be a valid number",
    },
    amountPaid: {
      required: true,
      custom: (value) =>
        !Number.isNaN(Number(value)) || "amountPaid must be a valid number",
    },
    paymentMethod: {
      type: "string",
      enum: ["cash", "bank-transfer", "mpesa", "card", "other"],
    },
    transactionReference: { type: "string", maxLength: 120 },
    notes: { type: "string", maxLength: 1000 },
  }),
  paymentController.recordPayment
);

module.exports = router;
