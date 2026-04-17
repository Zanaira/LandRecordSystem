import User from "../models/User.js";
import dotenv from "dotenv";
import { signToken } from "../utils/jwt.js";
dotenv.config();

// Get all users (admin only)
export async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Create user (hash handled by model)
export async function createUser(req, res) {
  try {
    const { username, password, full_name, role } = req.body;
    if (!username || !password || !full_name || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    if (!/[A-Z]/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one uppercase letter",
        });
    }

    if (!/[a-z]/.test(password)) {
      return res
        .status(400)
        .json({
          message: "Password must contain at least one lowercase letter",
        });
    }

    if (!/[0-9]/.test(password)) {
      return res
        .status(400)
        .json({ message: "Password must contain at least one number" });
    }

    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists)
      return res.status(409).json({ message: "Username already exists" });

    const user = new User({ username, password, full_name, role });
    await user.save();

    const token = signToken({ id: user._id, role: user.role });

    // Set as HTTP-only cookie (recommended)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // match expiresIn if you want
    });

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
      token, // include if you also support Authorization header usage
    });
  } catch (error) {
    console.error("createUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Login
export async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(400)
        .json({ message: "Username and password are required" });

    const user = await User.findOne({
      username: username.toLowerCase(),
    }).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        full_name: user.full_name,
      },
    });
   

  } catch (error) {
    console.error("loginUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Logout (clear cookie)
export async function logoutUser(_req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out" });
}

// Update user (non-password fields)
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body; // ignore password here
    const updated = await User.findByIdAndUpdate(id, rest, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated", user: updated });
  } catch (error) {
    console.error("updateUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Change password (use .save() to trigger hash)
export async function changePassword(req, res) {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(id).select("+password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const ok = await user.comparePassword(currentPassword);
    if (!ok)
      return res.status(401).json({ message: "Current password incorrect" });

    user.password = newPassword; // triggers hash on save
    await user.save();

    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    console.error("changePassword error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Delete user
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("deleteUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const changeRole = async (req, res) => {
  const { role } = req.body;

  if (!["Admin", "Clerk"].includes(role))
    return res.status(400).json({ message: "Invalid role" });

  if (req.params.id === req.user._id.toString())
    return res.status(400).json({ message: "You cannot change your own role" });

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "Role updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to update role" });
  }
};

