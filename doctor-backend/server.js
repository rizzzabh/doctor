import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.js";
import patientRoutes from "./src/routes/patients.js";
import prescriptionRoutes from "./src/routes/prescriptions.js"; // <-- ADD THIS
import appointmentRoutes from "./src/routes/appointments.js"; // <-- ADD THIS

// Load environment variables
dotenv.config();

const app = express();

// --- Database Connection ---
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};
connectDB();

// --- Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept JSON data

// --- API Routes ---
app.get("/", (req, res) => res.send("Doctor Backend API Running"));
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/prescriptions", prescriptionRoutes); // <-- ADD THIS
app.use("/api/appointments", appointmentRoutes); // <-- ADD THIS

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Doctor server running on port ${PORT}`));
