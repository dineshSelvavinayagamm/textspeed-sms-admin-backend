import prisma from "../../config/prisma.js";

/* ==========================================
   GET ALL USERS (ADMIN)
========================================== */
export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionTier: true,
        smsCredits: true,
        createdAt: true
      }
    });

    res.json(users);

  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================
   UPDATE USER (ADMIN ONLY)
   - Change role
   - Change smsCredits
========================================== */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, smsCredits } = req.body;

    // Validate role if provided
    if (role && !["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role value"
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(smsCredits !== undefined && {
          smsCredits: Number(smsCredits)
        })
      }
    });

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        smsCredits: updatedUser.smsCredits
      }
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};