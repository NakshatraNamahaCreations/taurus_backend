const express = require("express");
const router = express.Router();
const paymentController = require("../controller/Payment");

router.post("/createpayment", paymentController.createPayment);
router.get("/getallpayment", paymentController.getPayments);
router.get("/getpaymentbyid/:id", paymentController.getPaymentById);
router.put("/updatepayment/:id", paymentController.updatePayment);
router.delete("/deletepayment/:id", paymentController.deletePayment);
router.get("/getNextPaymentsdate",paymentController.getNextPaymentsdate)

module.exports = router;
