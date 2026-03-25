const Payment = require("../models/Payment");
const Property = require("../models/Property");
const asyncHandler = require("../utils/asyncHandler");

const getLandlordMatch = (user) => (user.role === "admin" ? {} : { landlord: user._id });

const getFinancialReport = asyncHandler(async (req, res) => {
  const match = getLandlordMatch(req.user);

  if (req.query.propertyId) {
    match.property = req.query.propertyId;
  }

  const payments = await Payment.find(match).lean();

  const totalCollected = payments.reduce((sum, item) => sum + item.amountPaid, 0);
  const totalExpected = payments.reduce((sum, item) => sum + item.amountDue, 0);
  const outstandingBalance = payments.reduce((sum, item) => sum + item.balance, 0);

  const byStatus = payments.reduce(
    (acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    },
    { pending: 0, partial: 0, paid: 0, overdue: 0 }
  );

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalCollected,
        totalExpected,
        outstandingBalance,
        collectionRate:
          totalExpected > 0 ? Number(((totalCollected / totalExpected) * 100).toFixed(2)) : 0,
      },
      paymentStatusBreakdown: byStatus,
      payments,
    },
  });
});

const getOccupancyReport = asyncHandler(async (req, res) => {
  const match = getLandlordMatch(req.user);
  const properties = await Property.find(match).lean();

  const totalProperties = properties.length;
  const totalUnits = properties.reduce((sum, item) => sum + item.totalUnits, 0);
  const availableUnits = properties.reduce((sum, item) => sum + item.availableUnits, 0);
  const occupiedUnits = totalUnits - availableUnits;
  const occupiedProperties = properties.filter((item) => item.status === "occupied").length;

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalProperties,
        totalUnits,
        occupiedUnits,
        availableUnits,
        occupiedProperties,
        occupancyRate:
          totalUnits > 0 ? Number(((occupiedUnits / totalUnits) * 100).toFixed(2)) : 0,
      },
      properties,
    },
  });
});

const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const propertyMatch = getLandlordMatch(req.user);
  const paymentMatch = getLandlordMatch(req.user);

  const [properties, payments] = await Promise.all([
    Property.find(propertyMatch).lean(),
    Payment.find(paymentMatch).lean(),
  ]);

  const totalUnits = properties.reduce((sum, item) => sum + item.totalUnits, 0);
  const availableUnits = properties.reduce((sum, item) => sum + item.availableUnits, 0);
  const totalCollected = payments.reduce((sum, item) => sum + item.amountPaid, 0);
  const outstandingBalance = payments.reduce((sum, item) => sum + item.balance, 0);

  res.status(200).json({
    success: true,
    data: {
      properties: {
        total: properties.length,
        available: properties.filter((item) => item.status === "available").length,
        occupied: properties.filter((item) => item.status === "occupied").length,
      },
      units: {
        total: totalUnits,
        occupied: totalUnits - availableUnits,
        available: availableUnits,
      },
      finances: {
        totalCollected,
        outstandingBalance,
      },
    },
  });
});

module.exports = {
  getFinancialReport,
  getOccupancyReport,
  getDashboardAnalytics,
};
