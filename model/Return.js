const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        clientName: {
            type: String,
            required: true,
        },

        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        productName: {
            type: String,
            required: true,
        },

        serialNumber: {
            type: String,
            required: true,
        },

        systemNumber: {
            type: String,
            required: true,
        },
        systemId: {
            type: String,
        },
        remarks: {
            type: String,
        },

        returnType: {
            type: String,
            enum: ["completed", "damaged"],
            required: true,
        },
        returnedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Return", returnSchema);
