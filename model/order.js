

const mongoose = require("mongoose");


const OrderSchema = new mongoose.Schema(
  {
    quotationId: { type: mongoose.Schema.Types.ObjectId, ref: "Quotation" },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "client", required: true },
    clientName: { type: String, required: true },
    products: Array,
    transportCharges: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    rentalType: { type: String, enum: ["daily", "monthly", "yearly"], default: "daily" },
    status: { type: String, enum: ["pending", "completed", "cancelled","confirmed"], default: "pending" },
     startDate: { type: Date, },
    endDate: { type: Date },
    invoiceNo: { type: String, unique: true }, 
     deliveryChallanNo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
