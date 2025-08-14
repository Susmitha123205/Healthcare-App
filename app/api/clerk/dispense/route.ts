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
    if (!decoded || decoded.role !== "clerk") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { recordId } = await request.json()

    if (!recordId) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    const result = await db.collection("patient_records").updateOne(
      { _id: new ObjectId(recordId) },
      {
        $set: {
          status: "dispensed",
          dispensedAt: new Date(),
          dispensedBy: `${decoded.firstName} ${decoded.lastName}`,
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Medication dispensed successfully" })
  } catch (error) {
    console.error("Dispense error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
