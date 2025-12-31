// routes/processorRoutes.js
const express = require("express");
const router = express.Router();
const {
    createProcessor,
    getProcessors,
    updateProcessor,
    deleteProcessor
} = require("../controller/Processor");

router.post("/addprocessor", createProcessor);
router.get("/allprocessor", getProcessors);
router.put("/update/:id", updateProcessor);
router.delete("/delete/:id", deleteProcessor);

module.exports = router;
