// const Order = require("../model/order");
// const Product = require("../model/product")

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
//       status,
//           startDate,
//       endDate,
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json({ message: "Order created successfully", order: savedOrder });
//   } catch (error) {
//     res.status(400).json({ message: "Error creating order", error: error.message });
//   }
// };



// exports.getOrders = async (req, res) => {
//   try {
//     const orders = await Order.find().populate("clientId").sort({ createdAt: -1 });
//     res.status(200).json(orders);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching quotations", error });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate("clientId", "name email")
//       .populate("quotationId", "quotationNumber");

//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json(order);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching order", error: error.message });
//   }
// };

// exports.getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const orderlist = await Order.findById(id)
//       .populate("clientId") 
//       .lean();

//     if (!orderlist) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.status(200).json(orderlist);
//   } catch (error) {
//     console.error("Error fetching quotation:", error);
//     res.status(500).json({ message: "Error fetching quotation", error: error.message });
//   }
// };

// exports.updateOrder = async (req, res) => {
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
//           startDate,
//       endDate,
//     } = req.body;

//     const updatedOrder = await Order.findByIdAndUpdate(
//       req.params.id,
//       {
//         quotationId,
//         clientId,
//         clientName,
//         products,
//         transportCharges,
//         gst,
//         discount,
//         grandTotal,
//         rentalType,
//         status,
//             startDate,
//       endDate,
//       },
//       { new: true, runValidators: true }
//     );

//     if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
//   } catch (error) {
//     res.status(400).json({ message: "Error updating order", error: error.message });
//   }
// };

// exports.deleteOrder = async (req, res) => {
//   try {
//     const deletedOrder = await Order.findByIdAndDelete(req.params.id);
//     if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting order", error: error.message });
//   }
// };


// exports.cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     if (order.status === "cancelled") {
//       return res.status(400).json({ message: "Order already cancelled" });
//     }

//     order.status = "cancelled";
//     await order.save();

//     res.status(200).json({ message: "Order cancelled successfully", order });
//   } catch (error) {
//     console.error("Error cancelling order:", error);
//     res.status(500).json({ message: "Failed to cancel order", error: error.message });
//   }
// };


// exports.updateOrderProduct = async (req, res) => {
//   try {
//     const { id, productId } = req.params;
//     const { productName, quantity, startDate, endDate } = req.body;

//     console.log("Request Body:", req.body);

//     const order = await Order.findById(id);
//     if (!order)
//       return res.status(404).json({ message: "Order not found" });

//     const productIndex = order.products.findIndex(
//       (p) =>
//         (p.productId && p.productId.toString() === productId) ||
//         (p._id && p._id.toString() === productId)
//     );

//     if (productIndex === -1)
//       return res.status(404).json({ message: "Product not found in order" });

//     const product = order.products[productIndex];

//     if (productName) product.productName = productName.trim();
//     if (quantity !== undefined && quantity !== null && quantity !== '') {
//       const newQuantity = parseInt(quantity);
//       product.quantity = newQuantity;
//       product.totalPrice = product.unitPrice * newQuantity;
//     }
//     if (startDate !== undefined && startDate !== null && startDate !== '') product.startDate = startDate;
//     if (endDate !== undefined && endDate !== null && endDate !== '') product.endDate = endDate;

//     order.markModified('products');

//     const existingProduct = await Product.findById(product.productId);
//     if (existingProduct) {
//       if (productName) existingProduct.productName = productName.trim();
//       await existingProduct.save();
//     }

//     if (startDate !== undefined && startDate !== null && startDate !== '') order.startDate = startDate;
//     if (endDate !== undefined && endDate !== null && endDate !== '') order.endDate = endDate;

//     await order.save();

//     console.log("Updated order", order);

//     res.status(200).json({
//       message: "Product and order updated successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Error updating order product:", error);
//     res.status(500).json({
//       message: "Error updating order product",
//       error: error.message,
//     });
//   }
// };



const Order = require("../model/order");
const Product = require("../model/product");


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
      status,
      startDate,
      endDate,
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ message: "No products provided in order" });
    }

    // Check and update inventory before saving order
    for (const item of products) {
      if (item.productId && item.quantity) {
        const product = await Product.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }

        if (product.availableQty < item.quantity) {
          return res.status(400).json({
            message: `Insufficient stock for ${product.productName}. Available: ${product.availableQty}`,
          });
        }

        // Deduct available quantity
        product.availableQty -= item.quantity;
        await product.save();
      }
    }

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
      status: "confirmed",
      startDate,
      endDate,
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: "Order created successfully and inventory updated",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: "Error creating order", error: error.message });
  }
};

// ============================
// 2️⃣ GET ALL ORDERS
// ============================
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

// ============================
// 3️⃣ GET ORDER BY ID
// ============================
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

// ============================
// 4️⃣ UPDATE ORDER + INVENTORY
// ============================
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
    } = req.body;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Restore old inventory first
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

    // Deduct new inventory
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

    // Update order details
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

// ============================
// 5️⃣ CANCEL ORDER + RETURN INVENTORY
// ============================
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
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

    order.status = "cancelled";
    await order.save();

    res.status(200).json({
      message: "Order cancelled and inventory restored successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error);
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// ============================
// 6️⃣ UPDATE SPECIFIC PRODUCT IN ORDER
// ============================
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

    // Restore old qty
    dbProduct.availableQty += orderProduct.quantity;

    // Deduct new qty
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

    // 1️⃣ Find the order first
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2️⃣ Restore product quantities in inventory
    for (const item of order.products) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.availableQty += item.quantity;

        // ensure availableQty never exceeds total stock
        if (product.availableQty > product.quantity) {
          product.availableQty = product.quantity;
        }

        await product.save();
      }
    }

    // 3️⃣ Delete the order after restoring stock
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