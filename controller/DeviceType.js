const DeviceType = require("../model/DeviceType");

exports.createDeviceType = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Device type name is required" });
        }

        const exists = await DeviceType.findOne({ name });
        if (exists) {
            return res.status(409).json({ message: "Device type already exists" });
        }

        const deviceType = await DeviceType.create({ name });

        res.status(201).json({
            success: true,
            message: "Device type created successfully",
            data: deviceType,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getDeviceTypes = async (req, res) => {
    try {
        const deviceTypes = await DeviceType.find().sort({ name: 1 });
        res.status(200).json(deviceTypes);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateDeviceType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Device type name is required" });
        }

        const deviceType = await DeviceType.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!deviceType) {
            return res.status(404).json({ message: "Device type not found" });
        }

        res.status(200).json({
            success: true,
            message: "Device type updated successfully",
            data: deviceType,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteDeviceType = async (req, res) => {
    try {
        const { id } = req.params;

        const deviceType = await DeviceType.findByIdAndDelete(id);

        if (!deviceType) {
            return res.status(404).json({ message: "Device type not found" });
        }

        res.status(200).json({
            success: true,
            message: "Device type deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
