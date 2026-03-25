const sendTokenResponse = (user, statusCode, res, message) => {
  const token = user.generateAuthToken();

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    data: {
      user: user.toSafeObject(),
    },
  });
};

module.exports = sendTokenResponse;
