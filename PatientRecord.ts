import mongoose from "mongoose"

const PatientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  symptoms: { type: String, required: true },
  medicalHistory: { type: String },
  currentMedications: { type: String },
  allergies: { type: String },
  vitalSigns: {
    bloodPressure: String,
    heartRate: String,
    temperature: String,
    weight: String,
  },
  doctorReview: {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    diagnosis: String,
    prescription: String,
    notes: String,
    reviewedAt: Date,
  },
  status: { type: String, enum: ["submitted", "reviewed", "completed"], default: "submitted" },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.PatientRecord || mongoose.model("PatientRecord", PatientRecordSchema)
