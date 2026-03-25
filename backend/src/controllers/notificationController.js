const Notification = require("../models/Notification");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const getMyNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id })
    .populate("metadata.booking", "status")
    .populate("metadata.property", "title")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: notifications.length,
    data: {
      notifications,
    },
  });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  if (notification.user.toString() !== req.user.id.toString()) {
    throw new AppError("You do not have permission to update this notification.", 403);
  }

  notification.isRead = true;
  await notification.save();

  res.status(200).json({
    success: true,
    message: "Notification marked as read.",
    data: {
      notification,
    },
  });
});

const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user.id, isRead: false },
    { $set: { isRead: true } }
  );

  res.status(200).json({
    success: true,
    message: "All notifications marked as read.",
  });
});

module.exports = {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
};
