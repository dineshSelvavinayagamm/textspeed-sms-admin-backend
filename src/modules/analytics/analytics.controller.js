import prisma from "../../config/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCampaigns = await prisma.campaign.count();

    const totals = await prisma.campaign.aggregate({
      _sum: {
        totalRecipients: true,
        sent: true,
        delivered: true,
        failed: true
      }
    });

    res.json({
      totalCampaigns,
      totalRecipients: totals._sum.totalRecipients || 0,
      totalSent: totals._sum.sent || 0,
      totalDelivered: totals._sum.delivered || 0,
      totalFailed: totals._sum.failed || 0
    });
  } catch (error) {
    console.error("ANALYTICS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};