const Product = require("../model/product");
const Order = require("../model/order");
const Return = require("../model/Return");

// exports.returnProduct = async (req, res) => {
//     try {
//         const {
//             orderId,
//             clientName,
//             productId,
//             productName,
//             serialNumber,
//             systemNumber,
//             remarks,
//             returnType
//         } = req.body;

//         if (!['completed', 'damaged'].includes(returnType)) {
//             return res.status(400).json({ message: "Invalid returnType. Must be 'completed' or 'damaged'." });
//         }

//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ message: "Order not found" });
//         }

//         const orderProduct = order.products.find(
//             (p) =>
//                 p.productId.toString() === productId &&
//                 p.serialNumber === serialNumber &&
//                 p.systemNumber === systemNumber
//         );

//         if (!orderProduct) {
//             return res.status(404).json({ message: "Product not found in order" });
//         }

//         if (orderProduct.isReturned) {
//             return res.status(400).json({ message: "Product already returned" });
//         }

//         const product = await Product.findById(productId);
//         if (!product) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         const system = product.systems.find(
//             (s) =>
//                 s.serialNumber === serialNumber &&
//                 s.systemNumber === systemNumber
//         );

//         if (!system) {
//             return res.status(404).json({ message: "System not found" });
//         }

//         if (returnType === "completed") {
//             system.isAvailable = true;
//             product.availableQty += 1;
//         } else if (returnType === "damaged") {
//             system.isAvailable = false;
//         }

//         await product.save();

//         orderProduct.isReturned = true;
//         orderProduct.returnedAt = new Date();

//         const allReturned = order.products.every(p => p.isReturned);
//         const anyReturned = order.products.some(p => p.isReturned);

//         if (allReturned) {
//             order.status = "returned";
//         } else if (anyReturned) {
//             order.status = "partial-return";
//         }

//         await order.save();

//         const returnEntry = await Return.create({
//             orderId,
//             clientName,
//             productId,
//             productName,
//             serialNumber,
//             systemNumber,
//             remarks,
//             returnedAt: new Date(),
//             returnType
//         });

//         res.status(200).json({
//             message: "Product returned successfully",
//             data: returnEntry,
//         });

//     } catch (error) {
//         console.error("Return error:", error);
//         res.status(500).json({
//             message: "Return failed",
//             error: error.message,
//         });
//     }
// };

exports.returnProduct = async (req, res) => {
    try {
        const {
            orderId,
            clientName,
            productId,
            productName,
            serialNumber,
            systemNumber,
            systemId,
            remarks,
            returnType
        } = req.body;

        if (!["completed", "damaged"].includes(returnType)) {
            return res.status(400).json({ message: "Invalid return type" });
        }

        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: "Order not found" });

        // 🔍 Find exact ordered system
        const orderProduct = order.products.find(
            p =>
                p.systemId === systemId &&
                p.productId.toString() === productId
        );

        if (!orderProduct) {
            return res.status(404).json({ message: "System not found in order" });
        }

        if (orderProduct.isReturned) {
            return res.status(400).json({ message: "System already returned" });
        }

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const system = product.systems.find(
            s => s._id.toString() === systemId
        );

        if (!system) {
            return res.status(404).json({ message: "System not found" });
        }

        // ✅ COMPLETED RETURN
        if (returnType === "completed") {
            system.isAvailable = true;
            product.availableQty += 1;

            // 🛡 safety guard
            if (product.availableQty > product.quantity) {
                product.availableQty = product.quantity;
            }
        }

        // ❌ DAMAGED RETURN
        if (returnType === "damaged") {
            system.isAvailable = false; // stays blocked
        }

        await product.save();

        // 🔁 Update order product
        orderProduct.isReturned = true;
        orderProduct.returnType = returnType;
        orderProduct.returnedAt = new Date();

        // 🔄 Order status
        const allReturned = order.products.every(p => p.isReturned);
        const anyReturned = order.products.some(p => p.isReturned);

        // if (allReturned) {
        //     order.status = "returned";
        // } else if (anyReturned) {
        //     order.status = "partial-return";
        // }

        await order.save();

        // 🧾 Save return history
        const returnEntry = await Return.create({
            orderId,
            clientName,
            productId,
            productName,
            serialNumber,
            systemNumber,
            systemId,
            remarks,
            returnType,
            returnedAt: new Date(),
        });

        res.status(200).json({
            message: `Product ${returnType} successfully`,
            data: returnEntry,
        });

    } catch (error) {
        console.error("Return Error:", error);
        res.status(500).json({
            message: "Return failed",
            error: error.message,
        });
    }
};

exports.getCompletedReturns = async (req, res) => {
    try {
        const returns = await Return.find({ returnType: "completed" })
            .populate("orderId")
            .populate("productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: returns.length,
            data: returns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch completed returns",
            error: error.message,
        });
    }
};

exports.getDamagedReturns = async (req, res) => {
    try {
        const returns = await Return.find({ returnType: "damaged" })
            .populate("orderId")
            .populate("productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: returns.length,
            data: returns,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch damaged returns",
            error: error.message,
        });
    }
};


exports.getAllReturns = async (req, res) => {
    try {
        const returns = await Return.find({})
            .populate("orderId")
            .populate("productId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: returns.length,
            data: returns,
        });
    } catch (error) {
        console.error("Get All Returns Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch returns",
            error: error.message,
        });
    }
};

