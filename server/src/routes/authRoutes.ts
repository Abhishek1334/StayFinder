import express from "express";
import { register, login, logout, getMe, refreshToken } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/me", protect, getMe);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

export default router; 