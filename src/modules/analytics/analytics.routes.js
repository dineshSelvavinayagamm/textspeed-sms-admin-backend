import express from "express";
import { getDashboardStats } from "./analytics.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Only ADMIN can see full dashboard stats
router.get("/dashboard", authMiddleware(["ADMIN"]), getDashboardStats);

export default router;