import express from "express";
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import {
    createHomeVisitController,
    getMyHomeVisitsController,
    getAllHomeVisitsController,
    updateHomeVisitStatusController,
} from "../controlllers/homeVisitController.js";
import JWT from "jsonwebtoken";

// Optional auth: attach req.user if a valid token is present, otherwise continue.
const optionalSignIn = (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const decode = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
            req.user = decode;
        }
    } catch (err) {
        // ignore invalid token; treat as guest
    }
    next();
};

const router = express.Router();

router.post("/create", optionalSignIn, createHomeVisitController);
router.get("/my-visits", requireSignIn, getMyHomeVisitsController);
router.get("/all", requireSignIn, isAdmin, getAllHomeVisitsController);
router.put("/status/:id", requireSignIn, isAdmin, updateHomeVisitStatusController);

export default router;
