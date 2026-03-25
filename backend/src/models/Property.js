const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Landlord is required"],
    },
    title: {
      type: String,
      required: [true, "Property title is required"],
      trim: true,
      minlength: [3, "Property title must be at least 3 characters long"],
      maxlength: [120, "Property title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: [true, "Property description is required"],
      trim: true,
      minlength: [20, "Description must be at least 20 characters long"],
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    propertyType: {
      type: String,
      enum: ["bedsitter", "studio", "apartment", "maisonette", "single-room"],
      required: [true, "Property type is required"],
    },
    status: {
      type: String,
      enum: ["draft", "available", "occupied", "inactive"],
      default: "available",
    },
    price: {
      type: Number,
      required: [true, "Monthly rent price is required"],
      min: [0, "Price cannot be negative"],
    },
    bedrooms: {
      type: Number,
      required: [true, "Number of bedrooms is required"],
      min: [0, "Bedrooms cannot be negative"],
    },
    bathrooms: {
      type: Number,
      required: [true, "Number of bathrooms is required"],
      min: [0, "Bathrooms cannot be negative"],
    },
    totalUnits: {
      type: Number,
      required: [true, "Total units is required"],
      min: [1, "Total units must be at least 1"],
    },
    availableUnits: {
      type: Number,
      required: [true, "Available units is required"],
      min: [0, "Available units cannot be negative"],
    },
    amenities: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    address: {
      county: {
        type: String,
        required: [true, "County is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      estate: {
        type: String,
        required: [true, "Estate or neighborhood is required"],
        trim: true,
      },
      streetAddress: {
        type: String,
        default: "",
        trim: true,
      },
    },
    features: {
      furnished: {
        type: Boolean,
        default: false,
      },
      parking: {
        type: Boolean,
        default: false,
      },
      petsAllowed: {
        type: Boolean,
        default: false,
      },
      wifiReady: {
        type: Boolean,
        default: false,
      },
      security: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

propertySchema.index({
  title: "text",
  description: "text",
  "address.city": "text",
  "address.estate": "text",
  propertyType: "text",
});

propertySchema.pre("validate", function (next) {
  if (this.availableUnits > this.totalUnits) {
    this.invalidate(
      "availableUnits",
      "Available units cannot exceed total units"
    );
  }

  next();
});

module.exports = mongoose.model("Property", propertySchema);
