import express from "express";
import Patient from "../models/Patient.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// --- ROUTE 1: ADD PATIENT ---
// @route   POST api/patients/add
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      sex,
      medical_history,
      code,
      grade,
      update_type,
      report_files, // <-- 1. Get the new field
    } = req.body;

    let patient = await Patient.findOne({ email });

    if (patient) {
      // Update existing patient
      patient.name = name;
      patient.age = age;
      patient.sex = sex;
      patient.medical_history = medical_history;
      patient.code = code;
      patient.grade = grade;
      patient.update_type = update_type;
      patient.report_files = report_files || []; // <-- 2. Update the field

      await patient.save();
      return res.status(200).json({ msg: "Patient updated", patient });
    }

    // Create new patient
    patient = new Patient({
      name,
      email,
      age,
      sex,
      medical_history,
      code,
      grade,
      update_type,
      report_files: report_files || [], // <-- 3. Save the field
    });

    await patient.save();
    res.status(201).json({ msg: "Patient added successfully", patient });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- ROUTE 2: GET ALL PATIENTS ---
// @route   GET api/patients
router.get("/", authMiddleware, async (req, res) => {
  try {
    const patients = await Patient.find().sort({ date_added: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// --- ROUTE 3: GET ONE PATIENT ---
// @route   GET api/patients/:id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(44).json({ msg: "Patient not found" });
    }
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Patient not found" });
    }
    res.status(500).send("Server Error");
  }
});

// --- ROUTE 4: SAVE STRUCTURE ---
// @route   PUT api/patients/:id/structure
router.put("/:id/structure", authMiddleware, async (req, res) => {
  try {
    const { molecular_structure } = req.body;

    let patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    patient.molecular_structure = molecular_structure;
    await patient.save();
    res.json(patient);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
