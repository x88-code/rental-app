const express = require("express");

const reportController = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, authorize("landlord", "admin"));

router.get("/dashboard", reportController.getDashboardAnalytics);
router.get("/financial", reportController.getFinancialReport);
router.get("/occupancy", reportController.getOccupancyReport);

module.exports = router;
