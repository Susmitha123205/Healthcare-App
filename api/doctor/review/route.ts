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
    if (!decoded || decoded.role !== "doctor") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { recordId, diagnosis, prescription } = await request.json()

    const client = await clientPromise
    const db = client.db("healthcare")

    const updateData: any = {
      diagnosis,
      reviewedBy: new ObjectId(decoded.userId),
      reviewedAt: new Date(),
      status: prescription ? "prescribed" : "reviewed",
    }

    if (prescription) {
      updateData.prescription = prescription
    }

    const result = await db
      .collection("patient_records")
      .updateOne({ _id: new ObjectId(recordId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    // Get the updated record to create prescription entry for clerk
    const record = await db.collection("patient_records").findOne({ _id: new ObjectId(recordId) })

    if (record && prescription) {
      // Create prescription entry for clerk dashboard
      const prescriptionEntry = {
        patientId: record.patientId,
        recordId: new ObjectId(recordId),
        doctorId: new ObjectId(decoded.userId),
        medication: prescription,
        dosage: "As prescribed",
        instructions: prescription,
        status: "pending",
        createdAt: new Date(),
      }

      await db.collection("prescriptions").insertOne(prescriptionEntry)

      // Create notification for patient
      await db.collection("notifications").insertOne({
        userId: record.patientId,
        type: "record_reviewed",
        title: "Medical Record Reviewed",
        message: `Your medical record has been reviewed by Dr. ${decoded.firstName} ${decoded.lastName}. A prescription has been issued and is being prepared by the pharmacy.`,
        createdAt: new Date(),
        read: false,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Failed to review record" }, { status: 500 })
  }
}
