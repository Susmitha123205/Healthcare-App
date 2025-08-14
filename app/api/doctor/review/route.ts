import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

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

    const { recordId, diagnosis, prescription, notes } = await request.json()

    if (!recordId || !diagnosis) {
      return NextResponse.json({ error: "Record ID and diagnosis are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    const updateData: any = {
      diagnosis,
      notes,
      doctorId: decoded.userId,
      doctorName: `Dr. ${decoded.firstName} ${decoded.lastName}`,
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

    return NextResponse.json({ message: "Review submitted successfully" })
  } catch (error) {
    console.error("Review error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
