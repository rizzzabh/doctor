import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Doctor from "../models/Doctor.js"; // Correct path to the model

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new doctor
router.post("/register", async (req, res) => {
  const { name, email, password, specialization } = req.body;

  try {
    let doctor = await Doctor.findOne({ email });
    if (doctor) {
      return res
        .status(400)
        .json({ msg: "Doctor with this email already exists" });
    }

    doctor = new Doctor({
      name,
      email,
      password,
      specialization,
    });

    const salt = await bcrypt.genSalt(10);
    doctor.password = await bcrypt.hash(password, salt);

    await doctor.save();

    const payload = {
      doctor: {
        id: doctor.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/auth/login
// @desc    Authenticate doctor & get token (Login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      doctor: {
        id: doctor.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
