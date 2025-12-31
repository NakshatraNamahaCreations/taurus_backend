// models/Processor.js
const mongoose = require("mongoose");

const processorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    }
}, { timestamps: true });

module.exports = mongoose.model("Processor", processorSchema);
