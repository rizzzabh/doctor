import mongoose from "mongoose";
const { Schema } = mongoose;

const AppointmentSchema = new Schema({
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  // The date and time of the appointment
  appointmentDate: {
    type: Date,
    required: true,
  },
  notes: {
    type: String,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Appointment", AppointmentSchema);
