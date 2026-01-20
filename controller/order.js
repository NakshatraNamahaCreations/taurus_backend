const Order = require("../model/order");
const Product = require("../model/product");

// exports.createOrder = async (req, res) => {
//   try {
//     const {
//       quotationId,
//       clientId,
//       clientName,
//       products,
//       transportCharges,
//       gst,
//       discount,
//       grandTotal,
//       rentalType,
//       status,
//       startDate,
//       endDate,
//     } = req.body;

//     if (!products || products.length === 0) {
//       return res.status(400).json({ message: "No products provided in order" });
//     }

//     for (const item of products) {
//       if (item.productId && item.quantity) {
//         const product = await Product.findById(item.productId);
//         if (!product) {
//           return res.status(404).json({ message: "Product not found" });
//         }

//         if (product.availableQty < item.quantity) {
//           return res.status(400).json({
//             message: `Insufficient stock for ${product.productName}. Available: ${product.availableQty}`,
//           });
//         }

//         product.availableQty -= item.quantity;
//         await product.save();
//       }
//     }

//     const newOrder = new Order({
//       quotationId,
//       clientId,
//       clientName,
//       products,
//       transportCharges,
//       gst,
//       discount,
//       grandTotal,
//       rentalType,
//       status: "pending",
//       startDate,
//       endDate,
//     });

//     const savedOrder = await newOrder.save();

//     res.status(201).json({
//       message: "Order created successfully and inventory updated",
//       order: savedOrder,
//     });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(400).json({ message: "Error creating order", error: error.message });
//   }
// };

exports.createOrder = async (req, res) => {
  try {
    const {
      quotationId,
      clientId,
      clientName,
      products,
      transportCharges,
      gst,
      discount,
      grandTotal,
      rentalType,
      startDate,
      endDate,
      taxType,
      igstRate,
      cgstRate,
      sgstRate,
      igstAmount,
      cgstAmount,
      sgstAmount,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided" });
    }

    // 🔐 STEP 1: VALIDATE ALL SYSTEMS FIRST
    for (const item of products) {
      const { productId, systemId } = item;

      if (!productId || !systemId) {
        return res.status(400).json({
          message: "Product ID or System ID missing",
        });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const system = product.systems.find(
        (s) => s._id.toString() === systemId
      );

      if (!system) {
        return res.status(404).json({ message: "System not found" });
      }

      // ❌ SYSTEM ALREADY LOCKED
      if (system.isAvailable === false) {
        return res.status(400).json({
          message: `System ${system.systemNumber} is already rented`,
        });
      }

      // ❌ NO INVENTORY LEFT
      if (product.availableQty <= 0) {
        return res.status(400).json({
          message: `No available inventory for ${product.productName}`,
        });
      }
    }

    // 🔒 STEP 2: LOCK SYSTEMS & UPDATE INVENTORY
    for (const item of products) {
      const { productId, systemId } = item;

      const product = await Product.findById(productId);

      const system = product.systems.find(
        (s) => s._id.toString() === systemId
      );

      // ✅ LOCK SYSTEM
      system.isAvailable = false;

      // ✅ SAFE INVENTORY UPDATE
      product.availableQty = Math.max(product.availableQty - 1, 0);

      await product.save();
    }

    // 🧾 STEP 3: CREATE ORDER
    const newOrder = new Order({
      quotationId,
      clientId,
      clientName,
      products,
      transportCharges,
      gst,
      discount,
      grandTotal,
      rentalType,
      status: "pending",
      startDate,
      endDate,
      taxType,
      igstRate,
      cgstRate,
      sgstRate,
      igstAmount,
      cgstAmount,
      sgstAmount,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully. Inventory locked safely.",
      order: savedOrder,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    res.status(500).json({
      message: "Error creating order",
      error: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("clientId")
      .populate("quotationId")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("clientId")
      .populate("quotationId");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};


exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      quotationId,
      clientId,
      clientName,
      products,
      transportCharges,
      gst,
      discount,
      grandTotal,
      rentalType,
      status,
      startDate,
      endDate,
      taxType,
      igstRate,
      cgstRate,
      sgstRate,
      igstAmount,
      cgstAmount,
      sgstAmount,
    } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    for (const oldItem of order.products) {
      const product = await Product.findById(oldItem.productId);
      if (product) {
        product.availableQty += oldItem.quantity;
        if (product.availableQty > product.quantity) {
          product.availableQty = product.quantity;
        }
        await product.save();
      }
    }

    for (const newItem of products) {
      const product = await Product.findById(newItem.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      if (product.availableQty < newItem.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product.productName}. Available: ${product.availableQty}`,
        });
      }

      product.availableQty -= newItem.quantity;
      await product.save();
    }

    order.quotationId = quotationId || order.quotationId;
    order.clientId = clientId || order.clientId;
    order.clientName = clientName || order.clientName;
    order.products = products || order.products;
    order.transportCharges = transportCharges || order.transportCharges;
    order.gst = gst || order.gst;
    order.discount = discount || order.discount;
    order.grandTotal = grandTotal || order.grandTotal;
    order.rentalType = rentalType || order.rentalType;
    order.status = status || order.status;
    order.startDate = startDate || order.startDate;
    order.endDate = endDate || order.endDate;
    order.taxType = taxType || order.taxType;
    order.igstRate = igstRate || order.igstRate;
    order.cgstRate = cgstRate || order.cgstRate;
    order.sgstRate = sgstRate || order.sgstRate;
    order.igstAmount = igstAmount || order.igstAmount;
    order.cgstAmount = cgstAmount || order.cgstAmount;
    order.sgstAmount = sgstAmount || order.sgstAmount;


    const updatedOrder = await order.save();

    res.status(200).json({
      message: "Order updated successfully and inventory adjusted",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};



// exports.cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.status === "cancelled") {
//       return res.status(400).json({ message: "Order already cancelled" });
//     }

//     for (const item of order.products) {
//       const product = await Product.findById(item.productId);
//       if (product) {
//         product.availableQty += item.quantity;
//         if (product.availableQty > product.quantity) {
//           product.availableQty = product.quantity;
//         }
//         await product.save();
//       }
//     }

//     order.status = "cancelled";
//     await order.save();

//     res.status(200).json({
//       message: "Order cancelled and inventory restored successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error cancelling order:", error);
//     res.status(500).json({
//       message: "Failed to cancel order",
//       error: error.message,
//     });
//   }
// };

exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      // 🔎 Find system used in order
      const system = product.systems.find(
        (s) => s._id.toString() === item.systemId
      );

      // 🔁 Restore system only once
      if (system && system.isAvailable === false) {
        system.isAvailable = true;

        // ✅ Increase available quantity
        product.availableQty += 1;

        // 🛡 Safety check
        if (product.availableQty > product.quantity) {
          product.availableQty = product.quantity;
        }

        await product.save();
      }
    }

    order.status = "cancelled";
    await order.save();

    return res.status(200).json({
      message: "Order cancelled. Inventory & systems restored successfully.",
      order,
    });

  } catch (error) {
    console.error("Cancel Order Error:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};


exports.updateOrderProduct = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { productName, quantity, startDate, endDate } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const productIndex = order.products.findIndex(
      (p) =>
        (p.productId && p.productId.toString() === productId) ||
        (p._id && p._id.toString() === productId)
    );

    if (productIndex === -1)
      return res.status(404).json({ message: "Product not found in order" });

    const orderProduct = order.products[productIndex];
    const dbProduct = await Product.findById(orderProduct.productId);

    dbProduct.availableQty += orderProduct.quantity;

    if (quantity) {
      const newQty = parseInt(quantity);
      if (dbProduct.availableQty < newQty) {
        return res.status(400).json({
          message: `Not enough stock for ${dbProduct.productName}. Available: ${dbProduct.availableQty}`,
        });
      }
      orderProduct.quantity = newQty;
      orderProduct.totalPrice = orderProduct.unitPrice * newQty;
      dbProduct.availableQty -= newQty;
    }

    if (productName) orderProduct.productName = productName;
    if (startDate) orderProduct.startDate = startDate;
    if (endDate) orderProduct.endDate = endDate;

    order.markModified("products");
    await order.save();
    await dbProduct.save();

    res.status(200).json({
      message: "Order product and inventory updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order product:", error);
    res.status(500).json({
      message: "Error updating order product",
      error: error.message,
    });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const {
      quotationId,
      clientId,
      clientName,
      products,
      transportCharges,
      gst,
      discount,
      grandTotal,
      rentalType,
      status,
      startDate,
      endDate,
    } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        quotationId,
        clientId,
        clientName,
        products,
        transportCharges,
        gst,
        discount,
        grandTotal,
        rentalType,
        status,
        startDate,
        endDate,
      },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
  } catch (error) {
    res.status(400).json({ message: "Error updating order", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.availableQty += item.quantity;

        if (product.availableQty > product.quantity) {
          product.availableQty = product.quantity;
        }

        await product.save();
      }
    }

    await Order.findByIdAndDelete(id);

    res.status(200).json({
      message: "Order deleted successfully and inventory restored",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({
      message: "Error deleting order",
      error: error.message,
    });
  }
};


exports.updateInvoiceNumber = async (req, res) => {
  try {
    const { id } = req.params;


    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }


    if (!order.invoiceNo) {

      const lastOrder = await Order.findOne({ invoiceNo: { $exists: true } })
        .sort({ createdAt: -1 });

      let nextNumber = 1;
      if (lastOrder && lastOrder.invoiceNo) {

        const lastNum = parseInt(lastOrder.invoiceNo.replace("INV", "")) || 0;
        nextNumber = lastNum + 1;
      }


      const newInvoiceNo = "INV" + nextNumber.toString().padStart(4, "0");
      order.invoiceNo = newInvoiceNo;
      await order.save();
    }

    res.status(200).json({
      success: true,
      message: "Invoice number updated successfully",
      invoiceNo: order.invoiceNo,
      order,
    });
  } catch (error) {
    console.error("Error updating invoice number:", error);
    res.status(500).json({
      success: false,
      message: "Error updating invoice number",
      error: error.message,
    });
  }
};


exports.updateDeliveryChallanNumber = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryChallanNo: newChallanNo } = req.body;

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (newChallanNo && newChallanNo.trim() !== "") {
      order.deliveryChallanNo = newChallanNo.trim();
    } else {
      if (!order.deliveryChallanNo) {
        const lastOrder = await Order.findOne({ deliveryChallanNo: { $exists: true } })
          .sort({ createdAt: -1 });

        let nextNumber = 1;
        if (lastOrder && lastOrder.deliveryChallanNo) {
          const lastNum = parseInt(lastOrder.deliveryChallanNo.replace("DC", "")) || 0;
          nextNumber = lastNum + 1;
        }

        order.deliveryChallanNo = "DC" + nextNumber.toString().padStart(4, "0");
      }
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Delivery challan number updated successfully",
      deliveryChallanNo: order.deliveryChallanNo,
      order,
    });
  } catch (error) {
    console.error("Error updating delivery challan number:", error);
    res.status(500).json({
      success: false,
      message: "Error updating delivery challan number",
      error: error.message,
    });
  }
};