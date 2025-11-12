const express = require("express");
const router = express.Router();
const clientController = require("../controller/clients");


router.post("/add-client", clientController.addClient);
router.get("/getallclients", clientController.getAllClients);
router.put("/edit-client/:id", clientController.updateClient);
router.delete("/deleteclient/:id", clientController.deleteClient);
router.put("/toggleactive/:id", clientController.toggleActiveStatus);

module.exports = router;
