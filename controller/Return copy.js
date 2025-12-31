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
//         } = req.body;

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

//         system.isAvailable = true;
//         product.availableQty += 1;
//         await product.save();

//         orderProduct.isReturned = true;
//         orderProduct.returnedAt = new Date();

//         const allReturned = order.products.every(p => p.isReturned);
//         order.status = allReturned ? "returned" : "partial-return";

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
//         });

//         res.status(200).json({
//             message: "Product returned successfully",
//             data: returnEntry,
//         });

//     } catch (error) {
//         console.log("error", error)
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
            remarks,
        } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const orderProduct = order.products.find(
            (p) =>
                p.productId.toString() === productId &&
                p.serialNumber === serialNumber &&
                p.systemNumber === systemNumber
        );

        if (!orderProduct) {
            return res.status(404).json({ message: "Product not found in order" });
        }

        if (orderProduct.isReturned) {
            return res.status(400).json({ message: "Product already returned" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const system = product.systems.find(
            (s) =>
                s.serialNumber === serialNumber &&
                s.systemNumber === systemNumber
        );

        if (!system) {
            return res.status(404).json({ message: "System not found" });
        }

        system.isAvailable = true;
        product.availableQty += 1;
        await product.save();

        orderProduct.isReturned = true;
        orderProduct.returnedAt = new Date();

        const allReturned = order.products.every(p => p.isReturned);
        const anyReturned = order.products.some(p => p.isReturned);

        if (allReturned) {
            order.status = "returned";
        } else if (anyReturned) {
            order.status = "partial-return";
        }

        await order.save();

        const returnEntry = await Return.create({
            orderId,
            clientName,
            productId,
            productName,
            serialNumber,
            systemNumber,
            remarks,
            returnedAt: new Date(),
        });

        res.status(200).json({
            message: "Product returned successfully",
            data: returnEntry,
        });

    } catch (error) {
        console.error("Return error:", error);
        res.status(500).json({
            message: "Return failed",
            error: error.message,
        });
    }
};
