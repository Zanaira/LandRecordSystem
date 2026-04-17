import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";
dotenv.config();

export async function protect(req, res, next) {
  try {
    let token;

    // Prefer HTTP-only cookie if you’re setting it there
    if (req.cookies?.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized: no token" });
    }
   


    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user (without password)
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Not authorized: invalid/expired token" });
  }
}

export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient role" });
    }
    next();
  };
}
