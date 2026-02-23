import express from "express";
import { getAllUsers } from "./user.controller.js";
import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Only ADMIN can access
router.get("/", authMiddleware(["ADMIN"]), getAllUsers);

export default router;