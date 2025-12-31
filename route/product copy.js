const express = require("express");
const router = express.Router();
const productController = require("../controller/product");

router.post("/addproduct", productController.addProduct);
router.get("/getallproducts", productController.getAllProducts);
router.get("/get-product/:id", productController.getProductById);
router.put("/updateproduct/:id", productController.updateProduct);
router.delete("/deleteproduct/:id", productController.deleteProduct);

module.exports = router;
