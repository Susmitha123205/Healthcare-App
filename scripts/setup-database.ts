import { MongoClient } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"

async function setupDatabase() {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("healthcare")

    // Create collections
    const collections = ["users", "patient_records", "messages"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } catch (error: any) {
        if (error.code === 48) {
          console.log(`Collection ${collectionName} already exists`)
        } else {
          console.error(`Error creating collection ${collectionName}:`, error)
        }
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("patient_records").createIndex({ patientId: 1 })
    await db.collection("patient_records").createIndex({ status: 1 })
    await db.collection("messages").createIndex({ patientId: 1 })

    console.log("Database indexes created successfully")

    // Create sample users (optional)
    const sampleUsers = [
      {
        firstName: "John",
        lastName: "Doe",
        email: "patient@demo.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/HK", // password: demo123
        role: "patient",
        createdAt: new Date(),
      },
      {
        firstName: "Dr. Sarah",
        lastName: "Smith",
        email: "doctor@demo.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/HK", // password: demo123
        role: "doctor",
        createdAt: new Date(),
      },
      {
        firstName: "Mike",
        lastName: "Johnson",
        email: "clerk@demo.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3/HK", // password: demo123
        role: "clerk",
        createdAt: new Date(),
      },
    ]

    for (const user of sampleUsers) {
      try {
        await db.collection("users").insertOne(user)
        console.log(`Created sample user: ${user.email}`)
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`Sample user ${user.email} already exists`)
        } else {
          console.error(`Error creating sample user ${user.email}:`, error)
        }
      }
    }

    console.log("\n🎉 Database setup completed successfully!")
    console.log("\n📋 Sample login credentials:")
    console.log("Patient: patient@demo.com / demo123")
    console.log("Doctor: doctor@demo.com / demo123")
    console.log("Pharmacy Clerk: clerk@demo.com / demo123")
  } catch (error) {
    console.error("Database setup failed:", error)
  } finally {
    await client.close()
  }
}

setupDatabase()
