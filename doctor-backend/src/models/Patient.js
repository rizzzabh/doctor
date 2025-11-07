import mongoose from "mongoose";
const { Schema } = mongoose;

const PatientSchema = new Schema({
  // Basic Info
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
  },
  medical_history: {
    type: Object,
  },

  // --- Data for Calculation ---
  code: {
    type: Object,
    required: true,
  },
  grade: {
    type: String,
  },

  // --- Calculated Data ---
  molecular_structure: {
    type: String, // Correctly set to String
    default: null,
  },

  // --- Update Status ---
  update_type: {
    type: String,
    enum: ["none", "prescription", "appointment"],
    default: "none",
  },

  // --- 👇 NEW FIELD TO STORE FILE URLS 👇 ---
  report_files: {
    type: Array, // Will store an array of objects like [{ name: '...', url: '...' }]
    default: [],
  },

  // --- Timestamps ---
  date_added: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Patient", PatientSchema);
