import express from "express";
import {
  createCampaign,
  getAllCampaigns,
  simulateCampaignSend
} from "./campaign.controller.js";

import { authMiddleware } from "../../middleware/auth.middleware.js";

const router = express.Router();

/* Create campaign (Any logged-in user) */
router.post("/", authMiddleware(), createCampaign);

/* Get campaigns (Admin → All, User → Own) */
router.get("/", authMiddleware(), getAllCampaigns);

/* Simulate sending (Admin only) */
router.patch(
  "/:id/simulate",
  authMiddleware(["ADMIN"]),
  simulateCampaignSend
);

export default router;