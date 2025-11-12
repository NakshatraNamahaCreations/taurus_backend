const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderProduct,
  cancelOrder,
  updateInvoiceNumber,
  updateDeliveryChallanNumber
} = require("../controller/order");

router.post("/createorder", createOrder);
router.get("/getallorder", getOrders);
router.get("/getorder/:id", getOrderById);
router.put("/editorder/:id", updateOrder);
router.delete("/deleteorder/:id", deleteOrder);
router.put('/cancelorder/:id', cancelOrder); 
router.put("/updateproduct/:id/:productId", updateOrderProduct);
router.put("/updateinvoice/:id", updateInvoiceNumber);
router.put("/updatedeliverychallanno/:id", updateDeliveryChallanNumber);

module.exports = router;
