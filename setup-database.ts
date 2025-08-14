// Database setup script for initial testing
import clientPromise from "@/lib/mongodb"

async function setupDatabase() {
  try {
    const client = await clientPromise
    const db = client.db("healthcare")

    console.log("🔧 Setting up database collections...")

    // Create indexes for better performance
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("patient_records").createIndex({ patientId: 1 })
    await db.collection("patient_records").createIndex({ status: 1 })
    await db.collection("prescriptions").createIndex({ patientId: 1 })
    await db.collection("prescriptions").createIndex({ status: 1 })
    await db.collection("notifications").createIndex({ userId: 1 })
    await db.collection("messages").createIndex({ recipientId: 1 })

    console.log("✅ Database setup complete!")
    console.log("📊 Collections created with proper indexes")
    console.log("🚀 Ready to start the application!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
  }
}

setupDatabase()
