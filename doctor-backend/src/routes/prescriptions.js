import express from "express";
import authMiddleware from "../middleware/auth.js";
import Prescription from "../models/Prescription.js";

const router = express.Router();

// @route   POST api/prescriptions/create
// @desc    Create a new prescription
// @access  Private
router.post("/create", authMiddleware, async (req, res) => {
  const { patientId, text } = req.body;
  const doctorId = req.doctor.id; // Get doctor ID from auth token

  try {
    const newPrescription = new Prescription({
      doctor: doctorId,
      patient: patientId,
      text: text,
    });

    const prescription = await newPrescription.save();

    // We should also update the patient's update_type back to 'none'
    // (We'll add that later, for now just save it)

    res.status(201).json(prescription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
