const Notification = require("../models/Notification");

const createNotification = async ({
  user,
  type,
  title,
  message,
  booking = null,
  property = null,
}) => {
  return Notification.create({
    user,
    type,
    title,
    message,
    metadata: {
      booking,
      property,
    },
  });
};

module.exports = {
  createNotification,
};
