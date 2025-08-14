import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== "patient") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    const records = await db
      .collection("patient_records")
      .find({ patientId: new ObjectId(decoded.userId) })
      .sort({ submittedAt: -1 })
      .toArray()

    return NextResponse.json({ records })
  } catch (error) {
    console.error("Fetch records error:", error)
    return NextResponse.json({ error: "Failed to fetch records" }, { status: 500 })
  }
}
