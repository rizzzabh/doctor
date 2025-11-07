import mongoose from "mongoose";
const { Schema } = mongoose;

const DoctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    default: "General",
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Doctor", DoctorSchema);
