const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Property = require("../models/Property");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { createNotification } = require("../services/notificationService");

const normalizeBillingMonth = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError("billingMonth must be a valid date.", 400);
  }

  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getDefaultDueDate = (billingMonth) =>
  new Date(billingMonth.getFullYear(), billingMonth.getMonth(), 5);

const populatePayment = (query) =>
  query
    .populate("tenant", "firstName lastName email phone")
    .populate("landlord", "firstName lastName email phone")
    .populate("property", "title price address")
    .populate("booking", "status allocatedUnitLabel");

const recordPayment = asyncHandler(async (req, res) => {
  const billingMonth = normalizeBillingMonth(req.body.billingMonth);
  const amountPaidNow = Number(req.body.amountPaid);

  if (Number.isNaN(amountPaidNow) || amountPaidNow <= 0) {
    throw new AppError("amountPaid must be a positive number.", 400);
  }

  const property = await Property.findById(req.body.propertyId);

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  let tenantId = req.user.id;

  if (req.user.role !== "tenant") {
    if (!req.body.tenantId) {
      throw new AppError("tenantId is required for this payment record.", 400);
    }

    tenantId = req.body.tenantId;
  }

  const tenant = await User.findById(tenantId);

  if (!tenant) {
    throw new AppError("Tenant not found.", 404);
  }

  if (req.user.role === "tenant" && tenantId.toString() !== req.user.id.toString()) {
    throw new AppError("You can only record payments for your own account.", 403);
  }

  if (
    req.user.role === "landlord" &&
    property.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only manage payments for your own properties.", 403);
  }

  const booking = await Booking.findOne({
    property: property._id,
    tenant: tenant._id,
    status: { $in: ["approved", "allocated"] },
  });

  if (!booking) {
    throw new AppError(
      "No active approved or allocated booking was found for this tenant and property.",
      404
    );
  }

  const dueDate = req.body.dueDate
    ? new Date(req.body.dueDate)
    : getDefaultDueDate(billingMonth);

  const amountDue = req.body.amountDue ? Number(req.body.amountDue) : Number(property.price);

  if (Number.isNaN(amountDue) || amountDue < 0) {
    throw new AppError("amountDue must be a valid non-negative number.", 400);
  }

  let payment = await Payment.findOne({
    property: property._id,
    tenant: tenant._id,
    billingMonth,
  });

  if (!payment) {
    payment = await Payment.create({
      property: property._id,
      tenant: tenant._id,
      landlord: property.landlord,
      booking: booking._id,
      billingMonth,
      dueDate,
      amountDue,
      amountPaid: amountPaidNow,
      paymentDate: new Date(),
      paymentMethod: req.body.paymentMethod || "mpesa",
      transactionReference: req.body.transactionReference?.trim() || "",
      notes: req.body.notes?.trim() || "",
    });
  } else {
    payment.amountDue = amountDue;
    payment.amountPaid += amountPaidNow;
    payment.paymentDate = new Date();
    payment.paymentMethod = req.body.paymentMethod || payment.paymentMethod;
    payment.transactionReference =
      req.body.transactionReference?.trim() || payment.transactionReference;
    payment.notes = req.body.notes?.trim() || payment.notes;
    if (req.body.dueDate) {
      payment.dueDate = dueDate;
    }
    await payment.save();
  }

  await createNotification({
    user: property.landlord,
    type: "payment_received",
    title: "Rent payment received",
    message: `${tenant.firstName} ${tenant.lastName} recorded a payment for ${property.title}.`,
    booking: booking._id,
    property: property._id,
  });

  const populatedPayment = await populatePayment(Payment.findById(payment._id));

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully.",
    data: {
      payment: populatedPayment,
    },
  });
});

const getPayments = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === "tenant") {
    query.tenant = req.user.id;
  } else if (req.user.role === "landlord") {
    query.landlord = req.user.id;
  }

  if (req.query.status) {
    query.status = req.query.status;
  }

  if (req.query.propertyId) {
    query.property = req.query.propertyId;
  }

  if (req.query.tenantId && req.user.role !== "tenant") {
    query.tenant = req.query.tenantId;
  }

  if (req.query.billingMonth) {
    query.billingMonth = normalizeBillingMonth(req.query.billingMonth);
  }

  const payments = await populatePayment(
    Payment.find(query).sort({ billingMonth: -1, createdAt: -1 })
  );

  res.status(200).json({
    success: true,
    results: payments.length,
    data: {
      payments,
    },
  });
});

const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await populatePayment(Payment.findById(req.params.id));

  if (!payment) {
    throw new AppError("Payment record not found.", 404);
  }

  const isAllowed =
    req.user.role === "admin" ||
    payment.tenant._id.toString() === req.user.id.toString() ||
    payment.landlord._id.toString() === req.user.id.toString();

  if (!isAllowed) {
    throw new AppError("You do not have permission to view this payment.", 403);
  }

  res.status(200).json({
    success: true,
    data: {
      payment,
    },
  });
});

module.exports = {
  recordPayment,
  getPayments,
  getPaymentById,
};
