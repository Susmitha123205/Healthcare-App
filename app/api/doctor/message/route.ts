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
    if (!decoded || decoded.role !== "doctor") {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { patientEmail, message } = await request.json()

    const client = await clientPromise
    const db = client.db("healthcare")

    // Find patient by email
    const patient = await db.collection("users").findOne({ email: patientEmail, role: "patient" })
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 })
    }

    // Create message
    const messageDoc = {
      userId: patient._id,
      fromRole: "doctor",
      fromName: `${decoded.firstName} ${decoded.lastName}`,
      message,
      sentAt: new Date(),
      read: false,
    }

    await db.collection("messages").insertOne(messageDoc)

    // Create notification
    const notification = {
      userId: patient._id,
      type: "message",
      title: "New Message from Doctor",
      message: `You have received a new message from Dr. ${decoded.firstName} ${decoded.lastName}`,
      createdAt: new Date(),
      read: false,
    }

    await db.collection("notifications").insertOne(notification)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
