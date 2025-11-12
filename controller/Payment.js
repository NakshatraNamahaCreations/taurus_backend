const Payment = require("../model/Payment");
const Order = require("../model/order");

exports.createPayment = async (req, res) => {
  try {
    const {
      orderId,
      clientId,
      paymentMethod,
      paymentType,
      amount,
      nextPaymentDate,
      notes,
      paymentStatus
    } = req.body;

    const newPayment = new Payment({
      orderId,
      clientId,
      paymentMethod,
      paymentType,
      amount,
      nextPaymentDate,
      notes,
      paymentStatus
    });

    const savedPayment = await newPayment.save();

    const order = await Order.findById(orderId);
    if (order) {
      order.paymentId = savedPayment._id;
      order.status = "confirmed";
      await order.save();
    }

    res.status(201).json({
      message: "Payment created and order confirmed successfully",
      payment: savedPayment,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    res
      .status(500)
      .json({ message: "Error creating payment", error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "orderId",
        populate: {
          path: "clientId",
          model: "client", 
        },
      })
      .populate("clientId") 
      .sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments found" });
    }

    res.status(200).json({
      message: "Payments fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};

exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("orderId")
      .populate("clientId");
    if (!payment)
      return res.status(404).json({ message: "Payment not found" });
    res.status(200).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching payment", error });
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPayment)
      return res.status(404).json({ message: "Payment not found" });

    res.status(200).json({
      message: "Payment updated successfully",
      payment: updatedPayment,
    });
  } catch (error) {
    res.status(400).json({ message: "Error updating payment", error });
  }
};

exports.deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    if (!deletedPayment)
      return res.status(404).json({ message: "Payment not found" });
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting payment", error });
  }
};


exports.getNextPaymentsdate = async (req, res) => {
  try {
    const payments = await Payment.find({
      nextPaymentDate: { $exists: true, $ne: null } 
    })
      .populate({
        path: "orderId",
        populate: {
          path: "clientId",
          model: "client",
        },
      })
      .populate("clientId")
      .sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
      return res.status(404).json({ message: "No payments with nextPaymentDate found" });
    }

    res.status(200).json({
      message: "Payments with nextPaymentDate fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message,
    });
  }
};
