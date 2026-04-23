import crypto from "crypto";
import Order from "../models/Order.js";

// eSewa sandbox / test credentials (publicly published by eSewa for sandbox use)
const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";
const ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";
const ESEWA_PAYMENT_URL =
    process.env.ESEWA_PAYMENT_URL || "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
const ESEWA_STATUS_URL =
    process.env.ESEWA_STATUS_URL ||
    "https://rc.esewa.com.np/api/epay/transaction/status/";
const CLIENT_BASE_URL = process.env.CLIENT_BASE_URL || "http://localhost:5173";
// Set to "true" in local/dev to skip the eSewa status-API double-check (useful for
// integration tests where you can't drive the real eSewa login UI). Always leave
// this OFF in production.
const ESEWA_SKIP_STATUS_CHECK = String(process.env.ESEWA_SKIP_STATUS_CHECK).toLowerCase() === "true";

const buildSignature = ({ total_amount, transaction_uuid, product_code }) => {
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    return crypto
        .createHmac("sha256", ESEWA_SECRET_KEY)
        .update(message)
        .digest("base64");
};

export const initiatePaymentController = async (req, res) => {
    try {
        const { productId, productTitle, productImage, productCategory, amount } = req.body;

        if (!productTitle || !amount) {
            return res.status(400).send({
                success: false,
                message: "productTitle and amount are required",
            });
        }

        const numericAmount = Number(amount);
        if (Number.isNaN(numericAmount) || numericAmount <= 0) {
            return res.status(400).send({ success: false, message: "Invalid amount" });
        }

        const transaction_uuid = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
        const total_amount = numericAmount.toFixed(2);

        const newOrder = await new Order({
            user: req.user._id,
            orderType: "Exclusive",
            isExclusive: true,
            productId,
            productTitle,
            productImage,
            productCategory,
            amount: numericAmount,
            paymentMethod: "esewa",
            paymentStatus: "Pending",
            transactionUuid: transaction_uuid,
        }).save();

        const signature = buildSignature({
            total_amount,
            transaction_uuid,
            product_code: ESEWA_PRODUCT_CODE,
        });

        const successUrl = `${CLIENT_BASE_URL}/payment/success`;
        const failureUrl = `${CLIENT_BASE_URL}/payment/failure`;

        const formData = {
            amount: numericAmount.toFixed(2),
            tax_amount: "0",
            total_amount,
            transaction_uuid,
            product_code: ESEWA_PRODUCT_CODE,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: successUrl,
            failure_url: failureUrl,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
        };

        return res.status(200).send({
            success: true,
            message: "Payment initiated",
            paymentUrl: ESEWA_PAYMENT_URL,
            formData,
            orderId: newOrder._id,
            transactionUuid: transaction_uuid,
        });
    } catch (error) {
        console.error("initiatePayment error:", error);
        return res.status(500).send({
            success: false,
            message: "Error initiating payment",
            error: error.message || String(error),
        });
    }
};

const checkStatusWithEsewa = async ({ product_code, total_amount, transaction_uuid }) => {
    const url = `${ESEWA_STATUS_URL}?product_code=${encodeURIComponent(product_code)}&total_amount=${encodeURIComponent(total_amount)}&transaction_uuid=${encodeURIComponent(transaction_uuid)}`;
    const r = await fetch(url, { headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(`Status API responded ${r.status}`);
    return r.json();
};

export const verifyPaymentController = async (req, res) => {
    try {
        const { encodedData } = req.body;

        if (!encodedData) {
            return res.status(400).send({ success: false, message: "Missing payment response" });
        }

        let decoded;
        try {
            const jsonStr = Buffer.from(encodedData, "base64").toString("utf-8");
            decoded = JSON.parse(jsonStr);
        } catch (e) {
            return res
                .status(400)
                .send({ success: false, message: "Could not decode payment response" });
        }

        const {
            transaction_code,
            status,
            transaction_uuid,
            signed_field_names,
            signature,
        } = decoded;

        if (!transaction_uuid) {
            return res
                .status(400)
                .send({ success: false, message: "Invalid payment response" });
        }

        const order = await Order.findOne({ transactionUuid: transaction_uuid });
        if (!order) {
            return res
                .status(404)
                .send({ success: false, message: "Order not found for this transaction" });
        }

        // Idempotency: if already completed, just return the current state
        if (order.paymentStatus === "Completed") {
            return res.status(200).send({
                success: true,
                message: "Payment already verified",
                order,
            });
        }

        // 1. Verify HMAC signature on the redirect payload
        const fields = (signed_field_names || "")
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
        const message = fields.map((f) => `${f}=${decoded[f]}`).join(",");
        const expectedSignature = crypto
            .createHmac("sha256", ESEWA_SECRET_KEY)
            .update(message)
            .digest("base64");

        const sigBuf = Buffer.from(expectedSignature);
        const recvBuf = Buffer.from(signature || "");
        const signatureValid =
            sigBuf.length === recvBuf.length && crypto.timingSafeEqual(sigBuf, recvBuf);

        if (!signatureValid) {
            order.paymentStatus = "Failed";
            await order.save();
            return res
                .status(400)
                .send({ success: false, message: "Invalid payment signature", order });
        }

        // 2. Defense-in-depth: confirm with eSewa's Status Check API (per official docs)
        let statusApiResp = null;
        if (!ESEWA_SKIP_STATUS_CHECK) {
            try {
                statusApiResp = await checkStatusWithEsewa({
                    product_code: ESEWA_PRODUCT_CODE,
                    total_amount: order.amount,
                    transaction_uuid,
                });
            } catch (e) {
                console.warn("eSewa status API check failed, falling back to signed payload:", e.message);
            }
        }

        const callbackComplete = String(status).toUpperCase() === "COMPLETE";
        const apiComplete = statusApiResp ? String(statusApiResp.status).toUpperCase() === "COMPLETE" : null;

        // If the API was reachable, trust it; otherwise fall back to the signed callback
        const isComplete = apiComplete !== null ? apiComplete : callbackComplete;

        order.paymentStatus = isComplete ? "Completed" : "Failed";
        order.transactionId = transaction_code || statusApiResp?.ref_id || order.transactionId;
        if (isComplete) order.status = "Pending";
        await order.save();

        return res.status(200).send({
            success: isComplete,
            message: isComplete
                ? "Payment verified"
                : `Payment ${statusApiResp?.status || status}`,
            order,
            statusApi: statusApiResp,
        });
    } catch (error) {
        console.error("verifyPayment error:", error);
        return res.status(500).send({
            success: false,
            message: "Error verifying payment",
            error: error.message || String(error),
        });
    }
};

// Dev-only helper to complete a pending order without going through eSewa.
// Gated on ESEWA_SKIP_STATUS_CHECK=true so it cannot be invoked in production.
export const devCompletePaymentController = async (req, res) => {
    try {
        if (!ESEWA_SKIP_STATUS_CHECK) {
            return res.status(403).send({
                success: false,
                message: "Dev complete is disabled (set ESEWA_SKIP_STATUS_CHECK=true to enable)",
            });
        }
        const { transactionUuid } = req.body;
        const query = transactionUuid
            ? { transactionUuid }
            : { user: req.user._id, paymentStatus: "Pending", isExclusive: true };
        const order = transactionUuid
            ? await Order.findOne(query)
            : await Order.findOne(query).sort({ createdAt: -1 });
        if (!order) {
            return res.status(404).send({ success: false, message: "No pending order found" });
        }
        if (String(order.user) !== String(req.user._id)) {
            return res.status(403).send({ success: false, message: "Not your order" });
        }
        order.paymentStatus = "Completed";
        order.transactionId = order.transactionId || `DEV-${Date.now()}`;
        order.status = "Pending";
        await order.save();
        return res.status(200).send({
            success: true,
            message: "Order marked as paid (dev mode)",
            order,
        });
    } catch (error) {
        console.error("devCompletePayment error:", error);
        return res.status(500).send({ success: false, message: "Error completing order" });
    }
};

export const markPaymentFailedController = async (req, res) => {
    try {
        const { transactionUuid } = req.body;
        if (!transactionUuid) {
            return res
                .status(400)
                .send({ success: false, message: "transactionUuid required" });
        }
        const order = await Order.findOneAndUpdate(
            { transactionUuid },
            { paymentStatus: "Failed" },
            { new: true }
        );
        return res.status(200).send({ success: true, order });
    } catch (error) {
        console.error("markPaymentFailed error:", error);
        return res
            .status(500)
            .send({ success: false, message: "Error updating order" });
    }
};
