import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "patient") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const {
      symptoms,
      bloodPressure,
      heartRate,
      temperature,
      weight,
      medicalHistory,
      currentMedications,
      height,
      age,
      emergencyContact,
    } = await request.json()

    const client = await clientPromise
    const db = client.db("healthcare")

    const patientRecord = {
      patientId: new ObjectId(decoded.userId),
      symptoms,
      vitalSigns: {
        bloodPressure,
        heartRate,
        temperature,
        weight,
      },
      medicalHistory,
      currentMedications,
      height,
      age,
      emergencyContact,
      submittedAt: new Date(),
      status: "pending",
    }

    const result = await db.collection("patient_records").insertOne(patientRecord)

    return NextResponse.json({ success: true, recordId: result.insertedId })
  } catch (error) {
    console.error("Submit error:", error)
    return NextResponse.json({ error: "Failed to submit record" }, { status: 500 })
  }
}
