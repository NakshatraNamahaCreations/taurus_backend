const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice
} = require('../controller/Invoicename');

router.post('/addinvoicename', createInvoice);
router.get('/getallinvoicename', getAllInvoices);
router.get('/invoicenamebyid/:id', getInvoiceById);
router.put('/updateinvoicename/:id', updateInvoice);
router.delete('/deleteinvoicename/:id', deleteInvoice);

module.exports = router;