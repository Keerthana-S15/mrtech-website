// backend/middleware/authMiddleware.js
//
// Verifies the JWT sent by the frontend in the Authorization header
// (format: "Bearer <token>"). On success, attaches req.admin with the
// admin's id, email, companyId, and isSuperAdmin flag so downstream
// controllers can scope data to the correct company.

import jwt from "jsonwebtoken";

export const requireAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded should contain: { adminId, email, companyId, isSuperAdmin }
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("🔥 Auth Middleware Error:", error.message);
    return res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
};

// Only allows MRtech's own super admin through — used for creating new
// company admin accounts, which regular company admins should not be able to do.
export const requireSuperAdmin = (req, res, next) => {
  if (!req.admin || !req.admin.isSuperAdmin) {
    return res.status(403).json({ success: false, error: "Super admin access required" });
  }
  next();
};