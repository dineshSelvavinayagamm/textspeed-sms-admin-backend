import prisma from "../../config/prisma.js";
import bcrypt from "bcryptjs";

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
        createdAt: true,
      },
    });

    res.json(users);

  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ==========================================
   CREATE USER (ADMIN ONLY)
   - Create ADMIN or USER
========================================== */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, smsCredits } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Validate role
    if (role && !["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role value",
      });
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        smsCredits: smsCredits || 0,
      },
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        smsCredits: newUser.smsCredits,
      },
    });

  } catch (error) {
    console.error("CREATE USER ERROR:", error);
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

    // Validate role
    if (role && !["ADMIN", "USER"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role value",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(role && { role }),
        ...(smsCredits !== undefined && {
          smsCredits: Number(smsCredits),
        }),
      },
    });

    res.json({
      message: "User updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        smsCredits: updatedUser.smsCredits,
      },
    });

  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};