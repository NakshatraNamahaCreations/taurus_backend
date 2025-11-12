const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["upi", "bankTransfer", "cash", "card"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    nextPaymentDate: {
      type: Date,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentStatus: { type: String, enum: ["paid", "pending"], default: "pending" },
    notes: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
