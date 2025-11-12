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
    price: {
      type: Number, 
      required: true,
    },
    depositAmount: {
      type: Number, 
      default: 0,
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
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;
