import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "clerk") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    // Get all prescriptions with patient and doctor information
    const prescriptions = await db
      .collection("prescriptions")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "patientId",
            foreignField: "_id",
            as: "patient",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "doctorId",
            foreignField: "_id",
            as: "doctor",
          },
        },
        {
          $unwind: "$patient",
        },
        {
          $unwind: "$doctor",
        },
        {
          $project: {
            medication: 1,
            dosage: 1,
            instructions: 1,
            status: 1,
            createdAt: 1,
            dispensedAt: 1,
            notes: 1,
            patientId: 1,
            patientName: { $concat: ["$patient.firstName", " ", "$patient.lastName"] },
            patientEmail: "$patient.email",
            doctorName: { $concat: ["$doctor.firstName", " ", "$doctor.lastName"] },
          },
        },
        {
          $sort: { createdAt: -1 },
        },
      ])
      .toArray()

    return NextResponse.json({ prescriptions })
  } catch (error) {
    console.error("Clerk fetch prescriptions error:", error)
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 })
  }
}
