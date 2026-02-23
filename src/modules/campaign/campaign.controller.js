import prisma from "../../config/prisma.js";

/* ===================================================
   Create Campaign + Deduct SMS Credits (Atomic)
=================================================== */
export const createCampaign = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { title, message, totalRecipients } = req.body;

    if (!title || !message || !totalRecipients) {
      return res.status(400).json({
        message: "Title, message and totalRecipients are required"
      });
    }

    if (totalRecipients <= 0) {
      return res.status(400).json({
        message: "Total recipients must be greater than 0"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.smsCredits < totalRecipients) {
      return res.status(400).json({
        message: "Insufficient SMS credits",
        availableCredits: user.smsCredits
      });
    }

    const campaign = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: req.user.id },
        data: {
          smsCredits: {
            decrement: totalRecipients
          }
        }
      });

      return await tx.campaign.create({
        data: {
          title,
          message,
          totalRecipients,
          userId: req.user.id,
          status: "PENDING"
        }
      });
    });

    res.status(201).json({
      message: "Campaign created successfully",
      campaign
    });

  } catch (error) {
    console.error("CREATE CAMPAIGN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================
   Get Campaigns
   ADMIN → All campaigns
   USER → Own campaigns only
=================================================== */
export const getAllCampaigns = async (req, res) => {
  try {
    let campaigns;

    if (req.user.role === "ADMIN") {
      campaigns = await prisma.campaign.findMany({
        include: {
          user: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: "desc" }
      });
    } else {
      campaigns = await prisma.campaign.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: "desc" }
      });
    }

    res.json(campaigns);

  } catch (error) {
    console.error("GET CAMPAIGNS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================================================
   Simulate Campaign Sending
   (For Demo / Analytics Purpose)
=================================================== */
export const simulateCampaignSend = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await prisma.campaign.findUnique({
      where: { id }
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (campaign.status === "SENT") {
      return res.status(400).json({
        message: "Campaign already sent"
      });
    }

    const delivered = Math.floor(campaign.totalRecipients * 0.9);
    const failed = campaign.totalRecipients - delivered;

    const updatedCampaign = await prisma.campaign.update({
      where: { id },
      data: {
        sent: campaign.totalRecipients,
        delivered,
        failed,
        status: "SENT"
      }
    });

    res.json({
      message: "Campaign simulated successfully",
      campaign: updatedCampaign
    });

  } catch (error) {
    console.error("SIMULATE ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};