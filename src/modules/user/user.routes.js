import express from "express";
import {
  getAllUsers,
  updateUser
} from "./user.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ADMIN only → Get all users
router.get("/", authMiddleware(["ADMIN"]), getAllUsers);

// ADMIN only → Update user (credits / role)
router.patch("/:id", authMiddleware(["ADMIN"]), updateUser);

export default router;