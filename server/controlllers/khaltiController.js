import crypto from "crypto";
import Order from "../models/Order.js";
import { User } from "../models/User.js";

const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || "05bf95cc57244045b8df5fad06748dab";
const KHALTI_INITIATE_URL =
    process.env.KHALTI_INITIATE_URL || "https://dev.khalti.com/api/v2/epayment/initiate/";
const KHALTI_LOOKUP_URL =
    process.env.KHALTI_LOOKUP_URL || "https://dev.khalti.com/api/v2/epayment/lookup/";
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "http://localhost:5173";

export const initiateKhaltiController = async (req, res) => {
    try {
        const { productId, productTitle, productImage, productCategory, amount, size } = req.body;

        if (!productTitle || !amount) {
            return res
                .status(400)
                .send({ success: false, message: "productTitle and amount are required" });
        }

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).send({ success: false, message: "Invalid amount" });
        }

        const purchaseOrderId = `cstitch-${Date.now()}-${crypto.randomBytes(3).toString("hex")}`;

        const newOrder = await new Order({
            user: req.user._id,
            orderType: "Exclusive",
            isExclusive: true,
            productId,
            productTitle,
            productImage,
            productCategory,
            amount: numericAmount,
            size: size || "N/A",
            paymentMethod: "khalti",
            paymentStatus: "Pending",
            transactionUuid: purchaseOrderId,
        }).save();

        const user = await User.findById(req.user._id).select("name email contact");

        const payload = {
            return_url: `${CLIENT_BASE_URL}/payment/khalti-success`,
            website_url: CLIENT_BASE_URL,
            // Khalti expects the amount in paisa (NPR * 100)
            amount: Math.round(numericAmount * 100),
            purchase_order_id: purchaseOrderId,
            purchase_order_name: productTitle,
            customer_info: {
                name: user?.name || "Customer",
                email: user?.email || "customer@example.com",
                phone: user?.contact || "9800000000",
            },
        };

        const khaltiResp = await fetch(KHALTI_INITIATE_URL, {
            method: "POST",
            headers: {
                Authorization: `key ${KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const khaltiBody = await khaltiResp.json();

        if (!khaltiResp.ok || !khaltiBody.pidx) {
            await Order.findByIdAndUpdate(newOrder._id, { paymentStatus: "Failed" });
            return res.status(502).send({
                success: false,
                message: "Khalti rejected the initiation",
                details: khaltiBody,
            });
        }

        newOrder.pidx = khaltiBody.pidx;
        await newOrder.save();

        return res.status(200).send({
            success: true,
            message: "Khalti payment initiated",
            paymentUrl: khaltiBody.payment_url,
            pidx: khaltiBody.pidx,
            expiresAt: khaltiBody.expires_at,
            orderId: newOrder._id,
        });
    } catch (error) {
        console.error("initiateKhalti error:", error);
        return res
            .status(500)
            .send({ success: false, message: "Error initiating Khalti payment", error: error.message });
    }
};

export const verifyKhaltiController = async (req, res) => {
    try {
        const { pidx } = req.body;
        if (!pidx) {
            return res.status(400).send({ success: false, message: "pidx is required" });
        }

        const order = await Order.findOne({ pidx });
        if (!order) {
            return res.status(404).send({ success: false, message: "Order not found for this pidx" });
        }

        // Idempotency
        if (order.paymentStatus === "Completed") {
            return res.status(200).send({ success: true, message: "Already verified", order });
        }

        const lookupResp = await fetch(KHALTI_LOOKUP_URL, {
            method: "POST",
            headers: {
                Authorization: `key ${KHALTI_SECRET_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pidx }),
        });
        const lookup = await lookupResp.json();

        if (!lookupResp.ok) {
            return res
                .status(502)
                .send({ success: false, message: "Khalti lookup failed", details: lookup });
        }

        const status = String(lookup.status || "").toUpperCase();
        const isComplete = status === "COMPLETED";

        // Optional sanity check on amount (Khalti returns total_amount in paisa)
        const expectedPaisa = Math.round(order.amount * 100);
        const amountMatches = Number(lookup.total_amount) === expectedPaisa;

        if (isComplete && !amountMatches) {
            order.paymentStatus = "Failed";
            await order.save();
            return res
                .status(400)
                .send({ success: false, message: "Amount mismatch", lookup, order });
        }

        order.paymentStatus = isComplete ? "Completed" : "Failed";
        order.transactionId = lookup.transaction_id || order.transactionId;
        if (isComplete) order.status = "Pending";
        await order.save();

        return res.status(200).send({
            success: isComplete,
            message: isComplete ? "Payment verified" : `Payment ${status || "not completed"}`,
            order,
            lookup,
        });
    } catch (error) {
        console.error("verifyKhalti error:", error);
        return res
            .status(500)
            .send({ success: false, message: "Error verifying Khalti payment", error: error.message });
    }
};
