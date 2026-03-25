const express = require("express");

const propertyController = require("../controllers/propertyController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validateMiddleware");

const router = express.Router();

const propertySchema = {
  title: { required: true, type: "string", minLength: 3, maxLength: 120 },
  description: {
    required: true,
    type: "string",
    minLength: 20,
    maxLength: 2000,
  },
  propertyType: {
    required: true,
    type: "string",
    enum: ["bedsitter", "studio", "apartment", "maisonette", "single-room"],
  },
  status: {
    type: "string",
    enum: ["draft", "available", "occupied", "inactive"],
  },
  price: {
    required: true,
    custom: (value) =>
      !Number.isNaN(Number(value)) || "price must be a valid number",
  },
  bedrooms: {
    required: true,
    custom: (value) =>
      !Number.isNaN(Number(value)) || "bedrooms must be a valid number",
  },
  bathrooms: {
    required: true,
    custom: (value) =>
      !Number.isNaN(Number(value)) || "bathrooms must be a valid number",
  },
  totalUnits: {
    required: true,
    custom: (value) =>
      !Number.isNaN(Number(value)) || "totalUnits must be a valid number",
  },
  availableUnits: {
    required: true,
    custom: (value, body) => {
      if (Number.isNaN(Number(value))) {
        return "availableUnits must be a valid number";
      }

      if (
        body.totalUnits !== undefined &&
        Number(value) > Number(body.totalUnits)
      ) {
        return "availableUnits cannot be greater than totalUnits";
      }

      return true;
    },
  },
  address: {
    required: true,
    custom: (value) => {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        return "address must be a valid object";
      }

      if (!value.county || !value.city || !value.estate) {
        return "address.county, address.city, and address.estate are required";
      }

      return true;
    },
  },
};

router.get(
  "/manage/mine",
  protect,
  authorize("landlord", "admin"),
  propertyController.getMyProperties
);

router.get("/", propertyController.getProperties);
router.get("/:id", propertyController.getPropertyById);

router.post(
  "/",
  protect,
  authorize("landlord", "admin"),
  validate(propertySchema),
  propertyController.createProperty
);

router.patch(
  "/:id",
  protect,
  authorize("landlord", "admin"),
  propertyController.updateProperty
);

router.delete(
  "/:id",
  protect,
  authorize("landlord", "admin"),
  propertyController.deleteProperty
);

module.exports = router;
