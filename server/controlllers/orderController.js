import Order from "../models/Order.js";

export const createOrderController = async (req, res) => {
    try {
        const { orderType, suitDesign, lapelType, fabricType, measurements } = req.body;

        if (!fabricType || !measurements) {
            return res.status(400).send({ message: "Fabric and measurements are required" });
        }

        const newOrder = await new Order({
            user: req.user._id,
            orderType: orderType || "Full Suit",
            suitDesign: suitDesign || "N/A",
            lapelType: lapelType || "N/A",
            fabricType,
            measurements,
        }).save();

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            newOrder,
        });
    } catch (error) {
        console.error("createOrder error:", error);
        res.status(500).send({
            success: false,
            message: "Error creating order",
            error: error.message || String(error),
        });
    }
};

export const getOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders,
        });
    } catch (error) {
        console.error("getOrders error:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching orders",
            error: error.message || String(error),
        });
    }
};

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email contact")
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("getAllOrders error:", error);
        res.status(500).send({
            success: false,
            message: "Error fetching orders",
            error: error.message || String(error),
        });
    }
};

export const cancelOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body || {};

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send({ success: false, message: "Order not found" });
        }
        if (String(order.user) !== String(req.user._id)) {
            return res.status(403).send({ success: false, message: "Not your order" });
        }
        if (order.status === "Cancelled") {
            return res.status(400).send({ success: false, message: "Order is already cancelled" });
        }
        // Once tailoring/fulfillment has started, the customer can't self-cancel.
        if (["In Progress", "Fitting", "Completed"].includes(order.status)) {
            return res.status(400).send({
                success: false,
                message: `Order is already ${order.status} and cannot be cancelled. Please contact support.`,
            });
        }

        const wasPaid = order.paymentStatus === "Completed";
        order.status = "Cancelled";
        order.cancelledBy = "User";
        order.cancelledAt = new Date();
        if (wasPaid) {
            order.paymentStatus = "Refunded";
            order.refundedAt = new Date();
        }
        if (reason) order.cancelReason = String(reason).slice(0, 500);
        await order.save();

        return res.status(200).send({
            success: true,
            message: wasPaid
                ? "Order cancelled. Refund of Rs. " + order.amount + " has been initiated."
                : "Order cancelled.",
            order,
            refunded: wasPaid,
        });
    } catch (error) {
        console.error("cancelOrder error:", error);
        return res
            .status(500)
            .send({ success: false, message: "Error cancelling order", error: error.message });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        const allowed = ["Pending", "In Progress", "Fitting", "Completed", "Cancelled"];
        if (!allowed.includes(status)) {
            return res.status(400).send({ success: false, message: "Invalid status" });
        }

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).send({ success: false, message: "Order not found" });
        }

        const isCancelling = status === "Cancelled" && order.status !== "Cancelled";
        if (isCancelling && !reason) {
            return res
                .status(400)
                .send({ success: false, message: "A reason is required when cancelling an order" });
        }

        order.status = status;

        if (isCancelling) {
            order.cancelledBy = "Admin";
            order.cancelledAt = new Date();
            order.cancelReason = String(reason).slice(0, 500);
            if (order.paymentStatus === "Completed") {
                order.paymentStatus = "Refunded";
                order.refundedAt = new Date();
            }
        }

        await order.save();

        const refunded = isCancelling && order.paymentStatus === "Refunded";
        res.status(200).send({
            success: true,
            message: isCancelling
                ? refunded
                    ? `Order cancelled. Refund of Rs. ${order.amount} has been initiated.`
                    : "Order cancelled."
                : "Order status updated",
            order,
            refunded,
        });
    } catch (error) {
        console.error("updateOrderStatus error:", error);
        res.status(500).send({
            success: false,
            message: "Error updating order status",
            error: error.message || String(error),
        });
    }
};
