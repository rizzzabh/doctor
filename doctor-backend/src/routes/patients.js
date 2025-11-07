import express from "express";
import Patient from "../models/Patient.js";
import authMiddleware from "../middleware/auth.js"; // Import auth middleware

const router = express.Router();

// @route   POST api/patients/add
// @desc    Add or update a patient (called by PATIENT-BACKEND)
// @access  Public
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
// @access  Private (Protected by auth)
router.get("/", authMiddleware, async (req, res) => {
  try {
    // We can now access the logged-in doctor's ID via req.doctor.id
    // (We'll use this later to show *only* their patients)
    const patients = await Patient.find().sort({ date_added: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// We will add more routes here soon:
// 1. GET /api/patients/:id (Get a single patient's details)
// @route   GET api/patients/:id
// @desc    Get a single patient by ID
// @access  Private
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    // We can add a check here later to make sure the doctor
    // is allowed to see this patient.

    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Patient not found" });
    }
    res.status(500).send("Server Error");
  }
});
// 2. PUT /api/patients/:id/structure (Save the calculated structure)

export default router;
