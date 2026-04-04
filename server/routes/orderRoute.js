import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { createOrderController, getOrdersController } from "../controlllers/orderController.js";

const router = express.Router();

// Create new order
router.post("/create", requireSignIn, createOrderController);

// Get user orders
router.get("/my-orders", requireSignIn, getOrdersController);

export default router;
