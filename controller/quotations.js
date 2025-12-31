const Quotation = require("../model/quotations");
const Order = require("../model/order");
const Product = require("../model/product");
const { default: mongoose } = require("mongoose");
const client = require("../model/clients")

exports.createQuotation = async (req, res) => {
  try {
    const {
      clientId,
      clientName,
      products,
      transportCharges = 0,
      gst = 0,
      discount = 0,
      rentalType,
      startDate,
      endDate,
      grandTotal
    } = req.body;
    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      return res.status(400).json({ message: "Invalid client ID format" });
    }
    const Client = client;
    const clientExists = await Client.findById(clientId);
    if (!clientExists) {
      return res.status(404).json({ message: "Client not found" });
    }
    const quotation = new Quotation({
      clientId,
      clientName,
      products,
      transportCharges,
      gst,
      discount,
      grandTotal,
      rentalType,
      startDate,
      endDate
    });
    await quotation.save();
    res.status(201).json(quotation);
  } catch (error) {
    console.error("Create Quotation Error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ID format", error: error.message });
    }
    res.status(500).json({ message: "Error creating quotation", error: error.message });
  }
};

exports.editQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, products, transportCharges = 0, gst = 0, discount = 0, rentalType, startDate, endDate, grandTotal } = req.body;
    const quotation = await Quotation.findByIdAndUpdate(
      id,
      {
        clientName,
        products,
        transportCharges,
        gst,
        discount,
        grandTotal,
        rentalType,
        startDate,
        endDate
      },
      { new: true }
    );

    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    res.status(200).json(quotation);
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ message: "Error editing quotation", error });
  }
};

exports.cancelQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findByIdAndUpdate(
      id,
      { status: "cancelled" },
      { new: true }
    );
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    res.status(200).json({ message: "Quotation cancelled", quotation });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling quotation", error });
  }
};

// exports.generateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const quotation = await Quotation.findById(id);
//     if (!quotation) return res.status(404).json({ message: "Quotation not found" });

//     for (let item of quotation.products) {
//       const product = await Product.findById(item.productId);
//       if (!product) return res.status(404).json({ message: `Product not found: ${item.productName}` });

//       if (product.availableQty < item.quantity) {
//         return res.status(400).json({
//           message: `Not enough quantity for product ${item.productName}. Available: ${product.availableQty}, Required: ${item.quantity}`
//         });
//       }
//     }

//     const order = new Order({
//       quotationId: quotation._id,
//       clientId: quotation.clientId,
//       clientName: quotation.clientName,
//       products: quotation.products,
//       transportCharges: quotation.transportCharges,
//       gst: quotation.gst,
//       discount: quotation.discount,
//       grandTotal: quotation.grandTotal,
//       rentalType: quotation.rentalType,
//       status: "pending",
//       startDate: quotation.startDate,
//       endDate: quotation.endDate,
//     });
//     await order.save();
//     for (let item of quotation.products) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { availableQty: -item.quantity } }
//       );
//     }
//     quotation.status = "confirmed";
//     await quotation.save();
//     res.status(201).json({ message: "Order generated and inventory updated", order });
//   } catch (error) {
//     res.status(500).json({ message: "Error generating order", error });
//   }
// };

exports.generateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id).populate("clientId");
    if (!quotation) return res.status(404).json({ message: "Quotation not found" });

    // Validate & prepare
    const updates = [];

    for (let item of quotation.products) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productName}` });
      }

      const system = product.systems.id(item.systemId);
      if (!system) {
        return res.status(404).json({ message: `System unit not found: ${item.systemId}` });
      }

      if (!system.isAvailable || system.quantity < item.quantity) {
        return res.status(400).json({
          message: `System ${system.systemNumber} unavailable. Available: ${system.quantity}, Requested: ${item.quantity}`,
        });
      }

      updates.push({ productId: product._id, systemId: item.systemId, deductQty: item.quantity });
    }

    // Create order
    const order = new Order({
      quotationId: quotation._id,
      clientId: quotation.clientId._id,
      clientName: quotation.clientName,
      products: quotation.products,
      transportCharges: quotation.transportCharges,
      gst: quotation.gst,
      discount: quotation.discount,
      grandTotal: quotation.grandTotal,
      rentalType: quotation.rentalType,
      status: "pending",
      startDate: quotation.startDate,
      endDate: quotation.endDate,
    });
    await order.save();

    // 🔁 Apply updates (safe sequential)
    for (let { productId, systemId, deductQty } of updates) {
      const product = await Product.findById(productId);
      const system = product.systems.id(systemId);
      const newQty = system.quantity - deductQty;
      const newIsAvailable = newQty > 0;

      await Product.updateOne(
        { _id: productId, "systems._id": systemId },
        {
          $inc: {
            "systems.$.quantity": -deductQty,
            availableQty: -deductQty
          },
          $set: { "systems.$.isAvailable": newIsAvailable }
        }
      );
    }

    quotation.status = "confirmed";
    await quotation.save();

    res.status(201).json({
      message: "Order generated and inventory updated",
      order,
    });

  } catch (error) {
    console.error("Error in generateOrder:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.getQuotationById = async (req, res) => {
  try {
    const { id } = req.params;
    const quotation = await Quotation.findById(id)
      .populate("clientId")
      .lean();
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    res.status(200).json(quotation);
  } catch (error) {
    console.error("Error fetching quotation:", error);
    res.status(500).json({ message: "Error fetching quotation", error: error.message });
  }
};

exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find().populate("clientId").sort({ createdAt: -1 });
    res.status(200).json(quotations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching quotations", error });
  }
};


exports.deleteProductFromQuotation = async (req, res) => {
  try {
    const { quotationId, productId } = req.params;
    const quotation = await Quotation.findById(quotationId);
    if (!quotation) {
      return res.status(404).json({ message: "Quotation not found" });
    }
    quotation.products = quotation.products.filter(
      (p) => p.productId.toString() !== productId
    );
    const subtotal = quotation.products.reduce(
      (acc, p) => acc + (p.totalPrice || 0),
      0
    );
    const gstAmount = (subtotal * quotation.gst) / 100;
    const discountAmount = (subtotal * quotation.discount) / 100;
    const grandTotal =
      subtotal + quotation.transportCharges + gstAmount - discountAmount;
    quotation.grandTotal = Math.round(grandTotal);
    await quotation.save();
    res.status(200).json({
      message: "Product removed successfully",
      quotation,
    });
  } catch (error) {
    console.error("Error deleting product from quotation:", error);
    res.status(500).json({
      message: "Error deleting product from quotation",
      error: error.message,
    });
  }
};