const express = require("express");
const router = express.Router();
const quotationController = require("../controller/quotations");

router.post("/createquotation", quotationController.createQuotation);

router.put("/editquotation/:id", quotationController.editQuotation);

router.put("/cancelquotation/:id", quotationController.cancelQuotation);

router.post("/generate-order/:id", quotationController.generateOrder);

router.delete("/delete-product/:quotationId/:productId", quotationController.deleteProductFromQuotation);
router.get("/getbyquotation/:id", quotationController.getQuotationById);
router.get("/getallquotation", quotationController.getAllQuotations);
router.delete(
  "/:quotationId/product/:productId",
  quotationController.deleteProductFromQuotation
);
module.exports = router;
