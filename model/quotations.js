// const mongoose = require("mongoose");

// const QuotationSchema = new mongoose.Schema(
//   {
//     clientId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "client",
//       required: true,
//     },
//     clientName: { type: String, required: true },
//     products:Array,
//     transportCharges: { type: Number, default: 0 },
//     gst: { type: Number, default: 0 },
//     discount: { type: Number, default: 0 },
//     grandTotal: { type: Number, required: true },
//     rentalType: { type: String, enum: ["daily", "monthly", "yearly"], default: "daily" },
//     startDate: { type: Date, required: true },
//     endDate: { type: Date, required: true },
//     status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Quotation", QuotationSchema);



const mongoose = require("mongoose");

const QuotationSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
    },
    clientName: { type: String, required: true },

    products: { type: Array, default: [] },

    transportCharges: { type: Number, default: 0 },

    // ✅ TAX TYPE + RATES
    taxType: {
      type: String,
      enum: ["igst", "cgst_sgst"],
      default: "cgst_sgst",
    },

    // total GST percentage (example 18)
    gst: { type: Number, default: 0 },

    // store breakup rates (optional but useful)
    igstRate: { type: Number, default: 0 },
    cgstRate: { type: Number, default: 0 },
    sgstRate: { type: Number, default: 0 },

    // ✅ store breakup amounts (optional but very useful for PDF)
    igstAmount: { type: Number, default: 0 },
    cgstAmount: { type: Number, default: 0 },
    sgstAmount: { type: Number, default: 0 },

    discount: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },

    rentalType: {
      type: String,
      enum: ["daily", "monthly", "yearly"],
      default: "daily",
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", QuotationSchema);

