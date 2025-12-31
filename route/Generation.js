const express = require("express");
const router = express.Router();

const {
    createGeneration,
    getGenerations,
    updateGeneration,
    deleteGeneration,
} = require("../controller/Generation");

router.post("/add", createGeneration);
router.get("/all", getGenerations);
router.put("/update/:id", updateGeneration);
router.delete("/delete/:id", deleteGeneration);

module.exports = router;
