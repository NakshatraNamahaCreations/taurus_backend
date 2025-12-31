const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },
    availableQty: {
      type: Number,
      default: 0,
    },
    systemNumber: {
      type: String,
    },
    serialNumber: {
      type: String,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
