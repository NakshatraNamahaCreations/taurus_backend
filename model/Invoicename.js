const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceName: {
    type: String,
    required: true,

  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoicename', invoiceSchema);