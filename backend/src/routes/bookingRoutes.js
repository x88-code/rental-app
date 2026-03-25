const express = require("express");

const bookingController = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

router.use(protect);

router.get(
  "/mine",
  authorize("tenant", "landlord", "admin"),
  bookingController.getMyBookings
);

router.get(
  "/:id",
  authorize("tenant", "landlord", "admin"),
  bookingController.getBookingById
);

router.post(
  "/",
  authorize("tenant"),
  validate({
    propertyId: { required: true, type: "string", minLength: 12, maxLength: 50 },
    requestedMoveInDate: {
      required: true,
      custom: (value) =>
        !Number.isNaN(new Date(value).getTime()) ||
        "requestedMoveInDate must be a valid date",
    },
    notes: { type: "string", maxLength: 1000 },
  }),
  bookingController.createBooking
);

router.patch(
  "/:id/approve",
  authorize("landlord", "admin"),
  validate({
    message: { type: "string", maxLength: 1000 },
  }),
  bookingController.approveBooking
);

router.patch(
  "/:id/reject",
  authorize("landlord", "admin"),
  validate({
    message: { type: "string", maxLength: 1000 },
  }),
  bookingController.rejectBooking
);

router.patch(
  "/:id/allocate",
  authorize("landlord", "admin"),
  validate({
    allocatedUnitLabel: {
      required: true,
      type: "string",
      minLength: 1,
      maxLength: 100,
    },
    message: { type: "string", maxLength: 1000 },
  }),
  bookingController.allocateBooking
);

router.patch(
  "/:id/cancel",
  authorize("tenant", "landlord", "admin"),
  bookingController.cancelBooking
);

module.exports = router;
