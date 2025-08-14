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
    if (!decoded || decoded.role !== "clerk") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { prescriptionId, notes } = await request.json()

    const client = await clientPromise
    const db = client.db("healthcare")

    const updateData: any = {
      status: "dispensed",
      dispensedBy: new ObjectId(decoded.userId),
      dispensedAt: new Date(),
    }

    if (notes) {
      updateData.notes = notes
    }

    const result = await db
      .collection("prescriptions")
      .updateOne({ _id: new ObjectId(prescriptionId) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Get prescription details to notify patient
    const prescription = await db.collection("prescriptions").findOne({ _id: new ObjectId(prescriptionId) })

    if (prescription) {
      // Create notification for patient
      await db.collection("notifications").insertOne({
        userId: prescription.patientId,
        type: "medication_dispensed",
        title: "Medication Ready for Pickup",
        message: `Your prescribed medication "${prescription.medication}" has been prepared and is ready for pickup. Please visit the pharmacy at your earliest convenience.`,
        createdAt: new Date(),
        read: false,
      })

      // Create message for patient
      await db.collection("messages").insertOne({
        userId: prescription.patientId,
        fromUserId: new ObjectId(decoded.userId),
        fromRole: "clerk",
        fromName: `${decoded.firstName} ${decoded.lastName}`,
        message: `Your medication "${prescription.medication}" is ready for pickup. ${notes ? `Note: ${notes}` : ""}`,
        sentAt: new Date(),
        read: false,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Dispense error:", error)
    return NextResponse.json({ error: "Failed to dispense medication" }, { status: 500 })
  }
}
