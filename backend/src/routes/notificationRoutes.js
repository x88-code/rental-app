const express = require("express");

const notificationController = require("../controllers/notificationController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("tenant", "landlord", "admin"));

router.get("/", notificationController.getMyNotifications);
router.patch("/read-all", notificationController.markAllNotificationsAsRead);
router.patch("/:id/read", notificationController.markNotificationAsRead);

module.exports = router;
