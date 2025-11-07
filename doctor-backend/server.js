import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.js";
import patientRoutes from "./src/routes/patients.js";

// Load environment variables
dotenv.config();

const app = express();

// --- Database Connection ---
// The function MUST be defined here
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected...");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

// Call the function to connect
connectDB();

// --- Middlewares ---
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Allow server to accept JSON data

// --- API Routes ---
app.get("/", (req, res) => res.send("Doctor Backend API Running"));
app.use("/api/auth", authRoutes); // All auth routes (register, login)
app.use("/api/patients", patientRoutes); // The new line for patient routes

// --- Start Server ---
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Doctor server running on port ${PORT}`));
