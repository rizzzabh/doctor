import mongoose from "mongoose";
const { Schema } = mongoose;

const PatientSchema = new Schema({
  // We'll link this patient to a doctor later,
  // but for now, we'll store all patients.

  // Basic Info from Patient Backend
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // So we don't add the same patient twice
  },
  age: {
    type: Number,
  },
  sex: {
    type: String,
  },
  medical_history: {
    type: Object, // Flexible field for the context object
  },

  // --- Data for Calculation ---
  code: {
    type: Object, // The JSON object you mentioned
    required: true,
  },
  grade: {
    type: String, // Or Number, based on what you expect
  },

  // --- Calculated Data (initially empty) ---
  molecular_structure: {
    type: String, // Will be stored here after frontend calculates it
    default: null,
  },

  // --- Update Status ---
  update_type: {
    type: String,
    enum: ["none", "prescription", "appointment"], // Only allows these values
    default: "none",
  },

  // --- Timestamps ---
  date_added: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Patient", PatientSchema);
