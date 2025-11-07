import express from "express";
import authMiddleware from "../middleware/auth.js";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// @route   POST api/appointments/create
// @desc    Create a new appointment
// @access  Private
router.post("/create", authMiddleware, async (req, res) => {
  const { patientId, appointmentDate, notes } = req.body;
  const doctorId = req.doctor.id;

  try {
    const newAppointment = new Appointment({
      doctor: doctorId,
      patient: patientId,
      appointmentDate: appointmentDate,
      notes: notes || "", // Notes are optional
    });

    const appointment = await newAppointment.save();

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

export default router;
