const Processor = require("../model/Processor");

exports.createProcessor = async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Processor name is required" });
        }

        const exists = await Processor.findOne({ name });
        if (exists) {
            return res.status(409).json({ message: "Processor already exists" });
        }

        const processor = await Processor.create({ name });
        res.status(201).json({
            success: true,
            message: "Processor created successfully",
            data: processor,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getProcessors = async (req, res) => {
    try {
        const processors = await Processor.find().sort({ name: 1 });
        res.status(200).json(processors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateProcessor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Processor name is required" });
        }

        const processor = await Processor.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );

        if (!processor) {
            return res.status(404).json({ message: "Processor not found" });
        }

        res.status(200).json({
            success: true,
            message: "Processor updated successfully",
            data: processor,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteProcessor = async (req, res) => {
    try {
        const { id } = req.params;

        const processor = await Processor.findByIdAndDelete(id);

        if (!processor) {
            return res.status(404).json({ message: "Processor not found" });
        }

        res.status(200).json({
            success: true,
            message: "Processor deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
