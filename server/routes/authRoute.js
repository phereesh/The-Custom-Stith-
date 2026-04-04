import express from "express";
import { registerController, loginController, forgotPasswordController, resetPasswordController, updateProfileController } from "../controlllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

// register
router.post("/register", registerController);

// login
router.post("/login", loginController);

// forgot password || method post
router.post("/forgot-password", forgotPasswordController);

// reset password || method post
router.post("/reset-password/:token", resetPasswordController);

// update profile || method put
router.put("/profile", requireSignIn, updateProfileController);

export default router;
