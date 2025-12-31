const Generation = require("../model/Generation");

/* ================= CREATE ================= */
exports.createGeneration = async (req, res) => {
    try {
        const { label, value } = req.body;

        if (!label || !value) {
            return res.status(400).json({ message: "Label and value are required" });
        }

        const exists = await Generation.findOne({ value });
        if (exists) {
            return res.status(409).json({ message: "Generation already exists" });
        }

        const generation = await Generation.create({ label, value });

        res.status(201).json({
            success: true,
            message: "Generation created successfully",
            data: generation,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= GET ALL ================= */
exports.getGenerations = async (req, res) => {
    try {
        const generations = await Generation.find().sort({ value: 1 });
        res.status(200).json(generations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= UPDATE ================= */
exports.updateGeneration = async (req, res) => {
    try {
        const { id } = req.params;
        const { label, value } = req.body;

        if (!label || !value) {
            return res.status(400).json({ message: "Label and value are required" });
        }

        const generation = await Generation.findByIdAndUpdate(
            id,
            { label, value },
            { new: true, runValidators: true }
        );

        if (!generation) {
            return res.status(404).json({ message: "Generation not found" });
        }

        res.status(200).json({
            success: true,
            message: "Generation updated successfully",
            data: generation,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

/* ================= DELETE ================= */
exports.deleteGeneration = async (req, res) => {
    try {
        const { id } = req.params;

        const generation = await Generation.findByIdAndDelete(id);

        if (!generation) {
            return res.status(404).json({ message: "Generation not found" });
        }

        res.status(200).json({
            success: true,
            message: "Generation deleted successfully",
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
