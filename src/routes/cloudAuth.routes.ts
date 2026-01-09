import { Router } from "express";
import { cloudAuthMiddleware } from "../middleware/cloudAuth.middleware";
import { CloudAuthController } from "../controllers/cloudAuth.controller";

const router = Router();

// POST account registration
router.post("/register", CloudAuthController.register);

// POST account login
router.post("/login", CloudAuthController.login);

// POST request password reset (send email with token)
router.post("/forgot-password", CloudAuthController.forgotPassword);

// POST reset password using token
router.post("/reset-password", CloudAuthController.resetPassword);

// POST verify email
router.post("/verify-email", CloudAuthController.verifyEmail);

export default router;
