const Booking = require("../models/Booking");
const Property = require("../models/Property");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { createNotification } = require("../services/notificationService");

const populateBooking = (query) =>
  query
    .populate("tenant", "firstName lastName email phone")
    .populate("landlord", "firstName lastName email phone")
    .populate("property", "title price address status availableUnits");

const createBooking = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.body.propertyId).populate(
    "landlord",
    "firstName lastName"
  );

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  if (property.status !== "available" || property.availableUnits < 1) {
    throw new AppError("This property is currently unavailable for booking.", 400);
  }

  if (property.landlord._id.toString() === req.user.id.toString()) {
    throw new AppError("You cannot book your own property.", 400);
  }

  const existingBooking = await Booking.findOne({
    property: property._id,
    tenant: req.user.id,
    status: { $in: ["pending", "approved", "allocated"] },
  });

  if (existingBooking) {
    throw new AppError(
      "You already have an active booking request for this property.",
      409
    );
  }

  const booking = await Booking.create({
    property: property._id,
    tenant: req.user.id,
    landlord: property.landlord._id,
    requestedMoveInDate: new Date(req.body.requestedMoveInDate),
    notes: req.body.notes?.trim() || "",
  });

  await createNotification({
    user: property.landlord._id,
    type: "booking_created",
    title: "New booking request",
    message: `${req.user.fullName} requested to book ${property.title}.`,
    booking: booking._id,
    property: property._id,
  });

  const populatedBooking = await populateBooking(Booking.findById(booking._id));

  res.status(201).json({
    success: true,
    message: "Booking request submitted successfully.",
    data: {
      booking: populatedBooking,
    },
  });
});

const getMyBookings = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "tenant"
      ? { tenant: req.user.id }
      : req.user.role === "landlord"
        ? { landlord: req.user.id }
        : {};

  const bookings = await populateBooking(
    Booking.find(query).sort({ createdAt: -1 })
  );

  res.status(200).json({
    success: true,
    results: bookings.length,
    data: {
      bookings,
    },
  });
});

const getBookingById = asyncHandler(async (req, res) => {
  const booking = await populateBooking(Booking.findById(req.params.id));

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const isOwner =
    booking.tenant._id.toString() === req.user.id.toString() ||
    booking.landlord._id.toString() === req.user.id.toString() ||
    req.user.role === "admin";

  if (!isOwner) {
    throw new AppError("You do not have permission to view this booking.", 403);
  }

  res.status(200).json({
    success: true,
    data: {
      booking,
    },
  });
});

const approveBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "property",
    "title availableUnits status"
  );

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (
    req.user.role !== "admin" &&
    booking.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only approve bookings for your properties.", 403);
  }

  if (booking.status !== "pending") {
    throw new AppError("Only pending bookings can be approved.", 400);
  }

  if (
    booking.property.status !== "available" ||
    Number(booking.property.availableUnits) < 1
  ) {
    throw new AppError("No available units remain for this property.", 400);
  }

  booking.status = "approved";
  booking.approvedAt = new Date();
  booking.landlordResponseMessage = req.body.message?.trim() || "";
  await booking.save();

  await createNotification({
    user: booking.tenant,
    type: "booking_approved",
    title: "Booking approved",
    message: `Your booking for ${booking.property.title} has been approved.`,
    booking: booking._id,
    property: booking.property._id,
  });

  const populatedBooking = await populateBooking(Booking.findById(booking._id));

  res.status(200).json({
    success: true,
    message: "Booking approved successfully.",
    data: {
      booking: populatedBooking,
    },
  });
});

const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate(
    "property",
    "title"
  );

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (
    req.user.role !== "admin" &&
    booking.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only reject bookings for your properties.", 403);
  }

  if (booking.status !== "pending") {
    throw new AppError("Only pending bookings can be rejected.", 400);
  }

  booking.status = "rejected";
  booking.landlordResponseMessage = req.body.message?.trim() || "";
  await booking.save();

  await createNotification({
    user: booking.tenant,
    type: "booking_rejected",
    title: "Booking rejected",
    message: `Your booking for ${booking.property.title} was not approved.`,
    booking: booking._id,
    property: booking.property._id,
  });

  const populatedBooking = await populateBooking(Booking.findById(booking._id));

  res.status(200).json({
    success: true,
    message: "Booking rejected successfully.",
    data: {
      booking: populatedBooking,
    },
  });
});

const allocateBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("property");

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (
    req.user.role !== "admin" &&
    booking.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only allocate bookings for your properties.", 403);
  }

  if (!["approved", "allocated"].includes(booking.status)) {
    throw new AppError("Only approved bookings can be allocated.", 400);
  }

  if (booking.status !== "allocated") {
    if (booking.property.availableUnits < 1) {
      throw new AppError("No available units remain for allocation.", 400);
    }

    booking.property.availableUnits -= 1;

    if (booking.property.availableUnits === 0) {
      booking.property.status = "occupied";
    }

    await booking.property.save();
  }

  booking.status = "allocated";
  booking.allocatedUnitLabel = req.body.allocatedUnitLabel.trim();
  booking.allocatedAt = new Date();
  booking.landlordResponseMessage = req.body.message?.trim() || booking.landlordResponseMessage;
  await booking.save();

  await createNotification({
    user: booking.tenant,
    type: "booking_allocated",
    title: "Unit allocated",
    message: `A unit has been allocated for your booking on ${booking.property.title}.`,
    booking: booking._id,
    property: booking.property._id,
  });

  const populatedBooking = await populateBooking(Booking.findById(booking._id));

  res.status(200).json({
    success: true,
    message: "Booking allocated successfully.",
    data: {
      booking: populatedBooking,
    },
  });
});

const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate("property");

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  const canCancel =
    booking.tenant.toString() === req.user.id.toString() ||
    booking.landlord.toString() === req.user.id.toString() ||
    req.user.role === "admin";

  if (!canCancel) {
    throw new AppError("You do not have permission to cancel this booking.", 403);
  }

  if (["cancelled", "rejected"].includes(booking.status)) {
    throw new AppError("This booking is already closed.", 400);
  }

  if (booking.status === "allocated") {
    booking.property.availableUnits = Math.min(
      booking.property.availableUnits + 1,
      booking.property.totalUnits
    );

    if (booking.property.availableUnits > 0 && booking.property.status === "occupied") {
      booking.property.status = "available";
    }

    await booking.property.save();
  }

  booking.status = "cancelled";
  booking.cancelledAt = new Date();
  await booking.save();

  const recipient =
    booking.tenant.toString() === req.user.id.toString()
      ? booking.landlord
      : booking.tenant;

  await createNotification({
    user: recipient,
    type: "booking_cancelled",
    title: "Booking cancelled",
    message: `A booking for ${booking.property.title} has been cancelled.`,
    booking: booking._id,
    property: booking.property._id,
  });

  const populatedBooking = await populateBooking(Booking.findById(booking._id));

  res.status(200).json({
    success: true,
    message: "Booking cancelled successfully.",
    data: {
      booking: populatedBooking,
    },
  });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  approveBooking,
  rejectBooking,
  allocateBooking,
  cancelBooking,
};
