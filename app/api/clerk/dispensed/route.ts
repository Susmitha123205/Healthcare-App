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

    const dispensed = await db
      .collection("patient_records")
      .find({ status: "dispensed" })
      .sort({ dispensedAt: -1 })
      .toArray()

    return NextResponse.json({ dispensed })
  } catch (error) {
    console.error("Fetch dispensed error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
