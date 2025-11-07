import express from "express";
import Patient from "../models/Patient.js";
// We'll add auth middleware later to protect these routes
// import auth from '../middleware/auth.js';

const router = express.Router();

// @route   POST api/patients/add
// @desc    Add a new patient (called by PATIENT-BACKEND)
// @access  Public (for now)
router.post("/add", async (req, res) => {
  try {
    const { name, email, age, sex, medical_history, code, grade, update_type } =
      req.body;

    // Check if patient already exists
    let patient = await Patient.findOne({ email });

    if (patient) {
      // If patient exists, just update their info and update_type
      patient.name = name;
      patient.age = age;
      patient.sex = sex;
      patient.medical_history = medical_history;
      patient.code = code;
      patient.grade = grade;
      patient.update_type = update_type;

      await patient.save();
      return res.status(200).json({ msg: "Patient updated", patient });
    }

    // If new patient, create and save
    patient = new Patient({
      name,
      email,
      age,
      sex,
      medical_history,
      code,
      grade,
      update_type,
      // molecular_structure is left as null by default
    });

    await patient.save();
    res.status(201).json({ msg: "Patient added successfully", patient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/patients
// @desc    Get all patients (for the doctor's dashboard)
// @access  Private (we'll add auth)
router.get("/", async (req, res) => {
  try {
    // Later, we'll filter this by doctor ID
    const patients = await Patient.find().sort({ date_added: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// We will add more routes here soon:
// 1. GET /api/patients/:id (Get a single patient's details)
// 2. PUT /api/patients/:id/structure (Save the calculated structure)

export default router;
