import { Router } from "express";
import { cloudAuthMiddleware } from "../middleware/cloudAuth.middleware";
import { CloudUserController } from "../controllers/cloudUser.controller";

const router = Router();

// GET logged account data
router.get("/me", cloudAuthMiddleware, CloudUserController.me);

// PATCH update logged account (telephone/password)
router.patch("/me", cloudAuthMiddleware, CloudUserController.updateMe);

export default router;