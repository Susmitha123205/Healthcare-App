import { type NextRequest, NextResponse } from "next/server"
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

    const { patientId, message } = await request.json()

    if (!patientId || !message) {
      return NextResponse.json({ error: "Patient ID and message are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    const messageDoc = {
      patientId,
      message,
      senderRole: "clerk",
      senderName: `${decoded.firstName} ${decoded.lastName}`,
      createdAt: new Date(),
    }

    await db.collection("messages").insertOne(messageDoc)

    return NextResponse.json({ message: "Message sent successfully" })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
