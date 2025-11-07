import mongoose from "mongoose";
const { Schema } = mongoose;

const PrescriptionSchema = new Schema({
  // Link to the doctor who wrote it
  doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  // Link to the patient it's for
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  // The actual prescription text
  text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Prescription", PrescriptionSchema);
