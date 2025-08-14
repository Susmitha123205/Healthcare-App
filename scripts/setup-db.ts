import { MongoClient } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/healthcare"

async function setupDatabase() {
  console.log("🔧 Setting up Healthcare Database...")

  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("healthcare")

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    if (!collectionNames.includes("users")) {
      await db.createCollection("users")
      console.log("✅ Created 'users' collection")
    }

    if (!collectionNames.includes("patient_records")) {
      await db.createCollection("patient_records")
      console.log("✅ Created 'patient_records' collection")
    }

    if (!collectionNames.includes("messages")) {
      await db.createCollection("messages")
      console.log("✅ Created 'messages' collection")
    }

    // Create indexes for better performance
    try {
      await db.collection("users").createIndex({ email: 1 }, { unique: true })
      await db.collection("patient_records").createIndex({ patientId: 1 })
      await db.collection("patient_records").createIndex({ status: 1 })
      await db.collection("patient_records").createIndex({ createdAt: -1 })
      await db.collection("messages").createIndex({ patientId: 1 })
      await db.collection("messages").createIndex({ recipientId: 1 })
      await db.collection("messages").createIndex({ senderId: 1 })
      await db.collection("messages").createIndex({ createdAt: -1 })
      console.log("✅ Database indexes created")
    } catch (error) {
      if (error.code === 11000) {
        console.log("ℹ️  Some indexes already exist - this is normal")
      } else {
        console.log("⚠️  Index creation warning:", error.message)
      }
    }

    console.log("")
    console.log("🎉 Database setup completed successfully!")
    console.log("📝 You can now register your own account on the website")
    console.log("🌐 Go to: http://localhost:3001")
    console.log("")
    console.log("💾 All data you enter will be permanently stored in MongoDB!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    console.log("Make sure MongoDB is running: sudo systemctl start mongod")
  } finally {
    await client.close()
  }
}

setupDatabase()
