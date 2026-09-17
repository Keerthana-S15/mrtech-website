import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import { db, checkFirestore } from "./config/firebase.js";
import enquiryRoutes from "./routes/enquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import demoOtpRoutes from "./routes/demoOtpRoutes.js";
import signupOtpRoutes from "./routes/signupOtpRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import geocodeRoutes from "./routes/geocodeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve Frontend Build
const frontendPath = path.resolve(__dirname, "..", "frontend", "build");
console.log("✅ Frontend path:", frontendPath);
app.use(express.static(frontendPath));

// Health check — re-probes Firestore so a revoked key shows up here as 503
// instead of as an empty storefront. Point Render's health check at this.
app.get("/api/health", async (req, res) => {
  const firestore = await checkFirestore();
  res.status(firestore.ok ? 200 : 503).json({
    status: firestore.ok ? "ok" : "degraded",
    firestore,
    uptimeSeconds: Math.round(process.uptime()),
  });
});

// API Routes
app.use("/api", enquiryRoutes);
app.use("/api", authRoutes);
app.use("/api", demoOtpRoutes);
app.use("/api", signupOtpRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.use("/api", geocodeRoutes);

// Admin Setup
app.post("/api/setup-admin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const userSnap = await db.collection("users").where("email", "==", email).get();
    if (!userSnap.empty) {
      const docId = userSnap.docs[0].id;
      await db.collection("users").doc(docId).update({ password: hashedPassword, updatedAt: new Date().toISOString() });
      res.json({ success: true, message: "Admin password updated", email, action: "updated" });
    } else {
      const docRef = await db.collection("users").add({
        fullName: "Admin", email, phone: "6874534901",
        password: hashedPassword, userType: "admin", createdAt: new Date().toISOString(),
      });
      res.json({ success: true, message: "Admin created", email, action: "created", adminId: docRef.id });
    }
  } catch (error) {
    console.error("🔥 Setup Admin Error:", error);
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

// All routes → Frontend (Express 5 compatible)
app.get("*", (req, res) => {
  const indexPath = path.resolve(__dirname, "..", "frontend", "build", "index.html");
  res.sendFile(indexPath);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║     🚀 SERVER RUNNING ON PORT: ${PORT}            ║
║     🌐 URL: http://localhost:${PORT}              ║
╚═══════════════════════════════════════════════════╝
  `);
});