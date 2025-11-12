const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    clientName: { type: String, required: true },
    products:Array,
    transportCharges: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    rentalType: { type: String, enum: ["daily", "monthly", "yearly"], default: "daily" },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", QuotationSchema);
