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
    if (!decoded || decoded.role !== "doctor") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    const pending = await db.collection("patient_records").find({ status: "pending" }).sort({ createdAt: -1 }).toArray()

    const reviewed = await db
      .collection("patient_records")
      .find({ status: { $in: ["reviewed", "prescribed"] } })
      .sort({ reviewedAt: -1 })
      .toArray()

    return NextResponse.json({ pending, reviewed })
  } catch (error) {
    console.error("Fetch records error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
