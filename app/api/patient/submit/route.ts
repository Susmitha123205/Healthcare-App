import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

    const formData = await request.json()

    const client = await clientPromise
    const db = client.db("healthcare")

    const patientRecord = {
      patientId: new ObjectId(decoded.userId),
      patientEmail: decoded.email,
      symptoms: formData.symptoms,
      painLevel: formData.painLevel,
      temperature: formData.temperature,
      bloodPressure: formData.bloodPressure,
      heartRate: formData.heartRate,
      weight: formData.weight,
      medicalHistory: formData.medicalHistory,
      allergies: formData.allergies,
      currentMedications: formData.currentMedications,
      additionalNotes: formData.additionalNotes,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("patient_records").insertOne(patientRecord)

    return NextResponse.json({
      message: "Medical form submitted successfully",
      recordId: result.insertedId,
    })
  } catch (error) {
    console.error("Submit error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
