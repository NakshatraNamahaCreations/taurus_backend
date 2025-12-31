const express = require("express");
const router = express.Router();

const {
    createDeviceType,
    getDeviceTypes,
    updateDeviceType,
    deleteDeviceType,
} = require("../controller/DeviceType");

router.post("/add", createDeviceType);
router.get("/all", getDeviceTypes);
router.put("/update/:id", updateDeviceType);
router.delete("/delete/:id", deleteDeviceType);

module.exports = router;
