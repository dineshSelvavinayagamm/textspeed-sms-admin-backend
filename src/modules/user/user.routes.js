import express from "express";
import {
  getAllUsers,
  updateUser,
  createUser
} from "./user.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

/*
  ============================================
  ADMIN ONLY ROUTES
  ============================================
*/

// Get all users
router.get("/", authMiddleware(["ADMIN"]), getAllUsers);

// Create new user (ADMIN or USER)
router.post("/", authMiddleware(["ADMIN"]), createUser);

// Update user (credits / role)
router.patch("/:id", authMiddleware(["ADMIN"]), updateUser);

export default router;