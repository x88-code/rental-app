const Property = require("../models/Property");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const parseStringArray = (value) => {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const buildSearchQuery = (query) => {
  const filters = {};

  if (query.q) {
    filters.$text = { $search: String(query.q).trim() };
  }

  if (query.propertyType) {
    filters.propertyType = query.propertyType;
  }

  if (query.city) {
    filters["address.city"] = new RegExp(String(query.city).trim(), "i");
  }

  if (query.estate) {
    filters["address.estate"] = new RegExp(String(query.estate).trim(), "i");
  }

  if (query.status) {
    filters.status = query.status;
  } else {
    filters.status = "available";
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};

    if (query.minPrice) {
      filters.price.$gte = Number(query.minPrice);
    }

    if (query.maxPrice) {
      filters.price.$lte = Number(query.maxPrice);
    }
  }

  if (query.bedrooms) {
    filters.bedrooms = { $gte: Number(query.bedrooms) };
  }

  if (query.availableOnly === "true") {
    filters.availableUnits = { $gt: 0 };
  }

  return filters;
};

const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create({
    landlord: req.user.id,
    title: req.body.title.trim(),
    description: req.body.description.trim(),
    propertyType: req.body.propertyType,
    status: req.body.status || "available",
    price: Number(req.body.price),
    bedrooms: Number(req.body.bedrooms),
    bathrooms: Number(req.body.bathrooms),
    totalUnits: Number(req.body.totalUnits),
    availableUnits: Number(req.body.availableUnits),
    amenities: parseStringArray(req.body.amenities),
    images: parseStringArray(req.body.images),
    address: {
      county: req.body.address.county.trim(),
      city: req.body.address.city.trim(),
      estate: req.body.address.estate.trim(),
      streetAddress: req.body.address.streetAddress?.trim() || "",
    },
    features: {
      furnished: Boolean(req.body.features?.furnished),
      parking: Boolean(req.body.features?.parking),
      petsAllowed: Boolean(req.body.features?.petsAllowed),
      wifiReady: Boolean(req.body.features?.wifiReady),
      security:
        req.body.features?.security !== undefined
          ? Boolean(req.body.features.security)
          : true,
    },
  });

  const populatedProperty = await property.populate(
    "landlord",
    "firstName lastName email phone"
  );

  res.status(201).json({
    success: true,
    message: "Property created successfully.",
    data: {
      property: populatedProperty,
    },
  });
});

const getProperties = asyncHandler(async (req, res) => {
  const filters = buildSearchQuery(req.query);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;
  const sort = req.query.sort === "priceAsc"
    ? { price: 1 }
    : req.query.sort === "priceDesc"
      ? { price: -1 }
      : { createdAt: -1 };

  const [properties, total] = await Promise.all([
    Property.find(filters)
      .populate("landlord", "firstName lastName phone")
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Property.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    results: properties.length,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
    data: {
      properties,
    },
  });
});

const getPropertyById = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id).populate(
    "landlord",
    "firstName lastName email phone"
  );

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  res.status(200).json({
    success: true,
    data: {
      property,
    },
  });
});

const getMyProperties = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin" ? {} : { landlord: req.user.id };

  const properties = await Property.find(query)
    .populate("landlord", "firstName lastName email phone")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    results: properties.length,
    data: {
      properties,
    },
  });
});

const updateProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  if (
    req.user.role !== "admin" &&
    property.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only update your own properties.", 403);
  }

  const updateMap = [
    "title",
    "description",
    "propertyType",
    "status",
    "price",
    "bedrooms",
    "bathrooms",
    "totalUnits",
    "availableUnits",
  ];

  updateMap.forEach((field) => {
    if (req.body[field] !== undefined) {
      property[field] =
        ["price", "bedrooms", "bathrooms", "totalUnits", "availableUnits"].includes(
          field
        )
          ? Number(req.body[field])
          : typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
    }
  });

  if (req.body.amenities !== undefined) {
    property.amenities = parseStringArray(req.body.amenities);
  }

  if (req.body.images !== undefined) {
    property.images = parseStringArray(req.body.images);
  }

  if (req.body.address) {
    property.address = {
      ...property.address.toObject(),
      ...req.body.address,
      county: req.body.address.county?.trim() || property.address.county,
      city: req.body.address.city?.trim() || property.address.city,
      estate: req.body.address.estate?.trim() || property.address.estate,
      streetAddress:
        req.body.address.streetAddress?.trim() || property.address.streetAddress,
    };
  }

  if (req.body.features) {
    property.features = {
      ...property.features.toObject(),
      ...req.body.features,
    };
  }

  await property.save();

  const populatedProperty = await property.populate(
    "landlord",
    "firstName lastName email phone"
  );

  res.status(200).json({
    success: true,
    message: "Property updated successfully.",
    data: {
      property: populatedProperty,
    },
  });
});

const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError("Property not found.", 404);
  }

  if (
    req.user.role !== "admin" &&
    property.landlord.toString() !== req.user.id.toString()
  ) {
    throw new AppError("You can only delete your own properties.", 403);
  }

  await property.deleteOne();

  res.status(200).json({
    success: true,
    message: "Property deleted successfully.",
  });
});

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  getMyProperties,
  updateProperty,
  deleteProperty,
};
