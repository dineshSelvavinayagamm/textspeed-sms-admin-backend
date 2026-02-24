import prisma from "../../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany();

    const totalCampaigns = campaigns.length;

    const totalRecipients = campaigns.reduce(
      (sum, c) => sum + c.totalRecipients,
      0
    );

    const totalSent = campaigns.reduce(
      (sum, c) => sum + c.sent,
      0
    );

    const totalDelivered = campaigns.reduce(
      (sum, c) => sum + c.delivered,
      0
    );

    const totalFailed = campaigns.reduce(
      (sum, c) => sum + c.failed,
      0
    );

    res.json({
      totalCampaigns,
      totalRecipients,
      totalSent,
      totalDelivered,
      totalFailed,
    });

  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};