import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, role } = await request.json()

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("healthcare")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)

    // Generate token
    const token = generateToken({
      userId: result.insertedId.toString(),
      email,
      role,
      firstName,
      lastName,
    })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId,
        firstName,
        lastName,
        email,
        role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
