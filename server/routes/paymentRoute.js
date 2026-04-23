import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
    initiatePaymentController,
    verifyPaymentController,
    markPaymentFailedController,
    devCompletePaymentController,
} from "../controlllers/paymentController.js";
import {
    initiateKhaltiController,
    verifyKhaltiController,
} from "../controlllers/khaltiController.js";

const router = express.Router();

// Create a pending exclusive order and get eSewa form payload
router.post("/initiate", requireSignIn, initiatePaymentController);

// Verify the eSewa response (base64 data string from success_url)
router.post("/verify", requireSignIn, verifyPaymentController);

// Mark an order as failed (called from failure_url page)
router.post("/failed", requireSignIn, markPaymentFailedController);

// Dev-only: complete the most recent pending order without going through eSewa.
// Gated server-side on ESEWA_SKIP_STATUS_CHECK=true.
router.post("/dev-complete", requireSignIn, devCompletePaymentController);

// Khalti payment gateway
router.post("/khalti/initiate", requireSignIn, initiateKhaltiController);
router.post("/khalti/verify", requireSignIn, verifyKhaltiController);

export default router;
