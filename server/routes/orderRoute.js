import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
    createOrderController,
    getOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
    cancelOrderController,
} from "../controlllers/orderController.js";

const router = express.Router();

// Create new order
router.post("/create", requireSignIn, createOrderController);

// Get user orders
router.get("/my-orders", requireSignIn, getOrdersController);

// User: cancel their own order (refunds payment if it was already Completed)
router.post("/cancel/:id", requireSignIn, cancelOrderController);

// Admin: list all orders
router.get("/all", requireSignIn, isAdmin, getAllOrdersController);

// Admin: update order status
router.put("/status/:id", requireSignIn, isAdmin, updateOrderStatusController);

export default router;
