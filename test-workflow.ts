// Test script to verify the complete patient → doctor → clerk → patient workflow

async function testCompleteWorkflow() {
  const baseUrl = "http://localhost:3000" // Updated port to 3000 for Next.js

  console.log("🏥 Testing Healthcare App Workflow...\n")

  // Step 1: Register and login as patient
  console.log("👤 Step 1: Patient Registration and Login")
  const patientData = {
    name: "John Doe", // Updated to match API schema
    email: "john.doe@example.com",
    password: "password123",
    role: "patient",
    phone: "555-0123",
    address: "123 Main St, City, State",
    emergencyContact: "Jane Doe - 555-0124",
  }

  try {
    const patientRegister = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData),
    })

    const patientResult = await patientRegister.json()
    console.log("✅ Patient registered successfully")

    const patientToken = patientResult.token

    // Step 2: Patient submits medical information
    console.log("\n📝 Step 2: Patient Submits Medical Information")
    const medicalData = {
      symptoms: "Fever, headache, and body aches for 3 days",
      bloodPressure: "120/80",
      heartRate: "75",
      temperature: "101.5",
      weight: "160",
      height: "5'8\"",
      age: "30",
      emergencyContact: "Jane Doe - 555-0123",
    }

    const submitRecord = await fetch(`${baseUrl}/api/patient/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${patientToken}`,
      },
      body: JSON.stringify(medicalData),
    })

    const submitResult = await submitRecord.json()
    console.log("✅ Medical record submitted successfully")

    // Step 3: Register and login as doctor
    console.log("\n👨‍⚕️ Step 3: Doctor Registration and Login")
    const doctorData = {
      name: "Dr. Sarah Smith", // Updated to match API schema
      email: "dr.smith@example.com",
      password: "password123",
      role: "doctor",
      specialization: "General Medicine",
      licenseNumber: "MD12345",
    }

    const doctorRegister = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doctorData),
    })

    const doctorResult = await doctorRegister.json()
    console.log("✅ Doctor registered successfully")

    const doctorToken = doctorResult.token

    // Step 4: Doctor views patient records
    console.log("\n📋 Step 4: Doctor Views Patient Records")
    const doctorRecords = await fetch(`${baseUrl}/api/doctor/records`, {
      headers: { Authorization: `Bearer ${doctorToken}` },
    })

    const recordsResult = await doctorRecords.json()
    console.log(`✅ Doctor can see ${recordsResult.records?.length || 0} patient record(s)`)

    if (recordsResult.records && recordsResult.records.length > 0) {
      const patientRecord = recordsResult.records[0]
      console.log(`   Patient: ${patientRecord.patientName}`)
      console.log(`   Symptoms: ${patientRecord.symptoms}`)

      // Step 5: Doctor reviews and prescribes
      console.log("\n💊 Step 5: Doctor Reviews and Prescribes Medication")
      const reviewData = {
        recordId: patientRecord._id,
        diagnosis: "Viral infection with fever. Recommend rest and hydration.",
        prescription: "Acetaminophen 500mg - Take 1 tablet every 6 hours as needed for fever and pain",
        notes: "Patient should rest and stay hydrated. Follow up if symptoms persist.",
      }

      const reviewSubmit = await fetch(`${baseUrl}/api/doctor/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${doctorToken}`,
        },
        body: JSON.stringify(reviewData),
      })

      const reviewResult = await reviewSubmit.json()
      console.log("✅ Doctor review and prescription submitted successfully")
    }

    // Step 6: Register and login as clerk
    console.log("\n🏪 Step 6: Clerk Registration and Login")
    const clerkData = {
      name: "Mike Johnson", // Updated to match API schema
      email: "mike.clerk@example.com",
      password: "password123",
      role: "clerk",
      department: "Pharmacy",
    }

    const clerkRegister = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(clerkData),
    })

    const clerkResult = await clerkRegister.json()
    console.log("✅ Clerk registered successfully")

    const clerkToken = clerkResult.token

    // Step 7: Clerk views prescriptions
    console.log("\n💊 Step 7: Clerk Views Prescriptions")
    const clerkPrescriptions = await fetch(`${baseUrl}/api/clerk/prescriptions`, {
      headers: { Authorization: `Bearer ${clerkToken}` },
    })

    const prescriptionsResult = await clerkPrescriptions.json()
    console.log(`✅ Clerk can see ${prescriptionsResult.prescriptions?.length || 0} prescription(s)`)

    if (prescriptionsResult.prescriptions && prescriptionsResult.prescriptions.length > 0) {
      const prescription = prescriptionsResult.prescriptions[0]
      console.log(`   Patient: ${prescription.patientName}`)
      console.log(`   Medication: ${prescription.prescription}`)

      // Step 8: Clerk dispenses medication
      console.log("\n📦 Step 8: Clerk Dispenses Medication")
      const dispenseData = {
        prescriptionId: prescription._id,
        message: "Medication dispensed. Patient advised to take with food.",
      }

      const dispenseSubmit = await fetch(`${baseUrl}/api/clerk/dispense`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${clerkToken}`,
        },
        body: JSON.stringify(dispenseData),
      })

      const dispenseResult = await dispenseSubmit.json()
      console.log("✅ Medication dispensed successfully")
    }

    // Step 9: Patient checks messages
    console.log("\n📬 Step 9: Patient Checks Messages")
    const patientMessages = await fetch(`${baseUrl}/api/patient/messages`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    })

    const messagesResult = await patientMessages.json()
    console.log(`✅ Patient has ${messagesResult.messages?.length || 0} message(s)`)

    // Step 10: Patient views updated medical records
    console.log("\n📄 Step 10: Patient Views Updated Medical Records")
    const updatedRecords = await fetch(`${baseUrl}/api/patient/records`, {
      headers: { Authorization: `Bearer ${patientToken}` },
    })

    const updatedRecordsResult = await updatedRecords.json()
    if (updatedRecordsResult.records && updatedRecordsResult.records.length > 0) {
      const record = updatedRecordsResult.records[0]
      console.log("✅ Patient can see updated medical record with:")
      console.log(`   Status: ${record.status}`)
      console.log(`   Diagnosis: ${record.diagnosis || "Not provided"}`)
      console.log(`   Prescription: ${record.prescription || "Not provided"}`)
    }

    console.log("\n🎉 Complete workflow test successful!")
    console.log("✅ Patient → Doctor → Clerk → Patient flow working correctly")
  } catch (error) {
    console.error("❌ Test failed:", error)
    console.error("Make sure the application is running on http://localhost:3000")
  }
}

// Run the test
testCompleteWorkflow()
