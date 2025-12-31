const express = require("express");
const router = express.Router();
const returnController = require("../controller/Return");

router.post("/return-product", returnController.returnProduct);
router.get("/completed", returnController.getCompletedReturns);
router.get("/damaged", returnController.getDamagedReturns);
router.get("/allreturn", returnController.getAllReturns);

module.exports = router;
