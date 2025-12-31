const mongoose = require("mongoose");

const deviceTypeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("DeviceType", deviceTypeSchema);
