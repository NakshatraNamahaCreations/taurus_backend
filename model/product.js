const mongoose = require("mongoose");

const systemSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
  },
  systemNumber: {
    type: String,
    required: true,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },

    brandName: {
      type: String,
      required: true,
    },

    deviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceType",
      required: true,
    },

    processor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Processor",
      required: true,
    },

    generation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Generation",
      required: true,
    },

    systems: {
      type: [systemSchema],
      default: [],
    },

    quantity: {
      type: Number,
      default: 0,
    },

    availableQty: {
      type: Number,
      default: 0,
    },

    description: String,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
