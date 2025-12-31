const mongoose = require("mongoose");

const generationSchema = new mongoose.Schema({
    label: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Generation", generationSchema);
