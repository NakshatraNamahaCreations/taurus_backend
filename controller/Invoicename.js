const Invoice = require('../model/Invoicename');

exports.createInvoice = async (req, res) => {
  try {
    const { invoiceName } = req.body;
    
    if (!invoiceName || invoiceName.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invoice name is required' 
      });
    }

    const newInvoice = new Invoice({ invoiceName });
    await newInvoice.save();
    
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: newInvoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: invoices
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const { invoiceName } = req.body;
    
    // Validation
    if (!invoiceName || invoiceName.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invoice name is required' 
      });
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { invoiceName },
      { new: true, runValidators: true }
    );
    
    if (!updatedInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: updatedInvoice
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!deletedInvoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};