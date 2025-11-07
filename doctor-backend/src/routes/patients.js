import express from "express";
import Patient from "../models/Patient.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// --- ROUTE 1: ADD PATIENT ---
// @route   POST api/patients/add
router.post("/add", async (req, res) => {
  try {
    const { name, email, age, sex, medical_history, code, grade, update_type } =
      req.body;

    let patient = await Patient.findOne({ email });

    if (patient) {
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

    patient = new Patient({
      name,
      email,
      age,
      sex,
      medical_history,
      code,
      grade,
      update_type,
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
      return res.status(404).json({ msg: "Patient not found" });
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
//
// THIS IS THE ROUTE THAT IS CAUSING THE 404.
// MAKE SURE THIS CODE IS IN YOUR FILE.
//
router.put("/:id/structure", authMiddleware, async (req, res) => {
  try {
    const { molecular_structure } = req.body;

    let patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ msg: "Patient not found" });
    }

    patient.molecular_structure = molecular_structure;

    await patient.save();

    res.json(patient); // Return the updated patient
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
