"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Stethoscope, LogOut, User, Clock, Activity } from "lucide-react"

export default function DoctorDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [pendingRecords, setPendingRecords] = useState([])
  const [reviewedRecords, setReviewedRecords] = useState([])
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [reviewData, setReviewData] = useState({
    diagnosis: "",
    prescription: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    const token = localStorage.getItem("token")

    if (!userData || !token) {
      router.push("/auth/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "doctor") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/doctor/records", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPendingRecords(data.pending || [])
        setReviewedRecords(data.reviewed || [])
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    }
  }

  const handleReview = async (recordId: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/doctor/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recordId,
          ...reviewData,
        }),
      })

      if (response.ok) {
        alert("Review submitted successfully!")
        setReviewData({ diagnosis: "", prescription: "", notes: "" })
        setSelectedRecord(null)
        fetchRecords()
      } else {
        alert("Failed to submit review")
      }
    } catch (error) {
      alert("Failed to submit review")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-3">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Doctor Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Dr. {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="hover:bg-red-50 hover:text-red-600 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed Reviews</p>
                  <p className="text-2xl font-bold text-gray-900">{reviewedRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingRecords.length + reviewedRecords.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-md p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "pending"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Pending Reviews ({pendingRecords.length})
          </button>
          <button
            onClick={() => setActiveTab("reviewed")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "reviewed"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Activity className="w-4 h-4 mr-2" />
            Completed Reviews ({reviewedRecords.length})
          </button>
        </div>

        {/* Pending Reviews Tab */}
        {activeTab === "pending" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Pending Patient Reviews</h2>

            {pendingRecords.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No pending reviews.</p>
                  <p className="text-gray-400 mt-2">All patient submissions have been reviewed.</p>
                </CardContent>
              </Card>
            ) : (
              pendingRecords.map((record: any, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <User className="w-5 h-5 mr-2 text-green-600" />
                          {record.patientName}
                        </CardTitle>
                        <CardDescription>
                          Submitted:{" "}
                          {new Date(record.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Pending Review
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Patient Symptoms:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{record.symptoms}</p>
                    </div>

                    {record.painLevel && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Pain Level:</h4>
                        <Badge
                          variant={
                            Number.parseInt(record.painLevel) <= 3
                              ? "secondary"
                              : Number.parseInt(record.painLevel) <= 6
                                ? "default"
                                : "destructive"
                          }
                        >
                          {record.painLevel}/10
                        </Badge>
                      </div>
                    )}

                    {(record.temperature || record.bloodPressure || record.heartRate || record.weight) && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Vital Signs:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {record.temperature && (
                            <div className="bg-blue-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Temperature</p>
                              <p className="font-medium">{record.temperature}°F</p>
                            </div>
                          )}
                          {record.bloodPressure && (
                            <div className="bg-red-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Blood Pressure</p>
                              <p className="font-medium">{record.bloodPressure}</p>
                            </div>
                          )}
                          {record.heartRate && (
                            <div className="bg-pink-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Heart Rate</p>
                              <p className="font-medium">{record.heartRate} BPM</p>
                            </div>
                          )}
                          {record.weight && (
                            <div className="bg-green-50 p-3 rounded-md">
                              <p className="text-sm text-gray-600">Weight</p>
                              <p className="font-medium">{record.weight} lbs</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {(record.allergies || record.currentMedications || record.medicalHistory) && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Medical Information:</h4>
                        {record.allergies && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Allergies:</p>
                            <p className="text-gray-700">{record.allergies}</p>
                          </div>
                        )}
                        {record.currentMedications && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Current Medications:</p>
                            <p className="text-gray-700">{record.currentMedications}</p>
                          </div>
                        )}
                        {record.medicalHistory && (
                          <div>
                            <p className="text-sm font-medium text-gray-600">Medical History:</p>
                            <p className="text-gray-700">{record.medicalHistory}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedRecord?._id === record._id ? (
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-4">
                        <h4 className="font-semibold text-green-800">Provide Medical Review:</h4>
                        <div>
                          <Label htmlFor="diagnosis">Diagnosis *</Label>
                          <Textarea
                            id="diagnosis"
                            value={reviewData.diagnosis}
                            onChange={(e) => setReviewData({ ...reviewData, diagnosis: e.target.value })}
                            placeholder="Enter your diagnosis..."
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="prescription">Prescription</Label>
                          <Textarea
                            id="prescription"
                            value={reviewData.prescription}
                            onChange={(e) => setReviewData({ ...reviewData, prescription: e.target.value })}
                            placeholder="Enter prescription details (medication, dosage, instructions)..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="notes">Additional Notes</Label>
                          <Textarea
                            id="notes"
                            value={reviewData.notes}
                            onChange={(e) => setReviewData({ ...reviewData, notes: e.target.value })}
                            placeholder="Any additional notes or recommendations..."
                          />
                        </div>
                        <div className="flex space-x-3">
                          <Button
                            onClick={() => handleReview(record._id)}
                            disabled={loading || !reviewData.diagnosis}
                            className="bg-gradient-to-r from-green-500 to-green-600"
                          >
                            {loading ? "Submitting..." : "Submit Review"}
                          </Button>
                          <Button onClick={() => setSelectedRecord(null)} variant="outline">
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => setSelectedRecord(record)}
                        className="bg-gradient-to-r from-green-500 to-green-600"
                      >
                        Review Patient
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Reviewed Records Tab */}
        {activeTab === "reviewed" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Completed Reviews</h2>

            {reviewedRecords.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No completed reviews yet.</p>
                  <p className="text-gray-400 mt-2">Reviewed patient cases will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              reviewedRecords.map((record: any, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <User className="w-5 h-5 mr-2 text-green-600" />
                          {record.patientName}
                        </CardTitle>
                        <CardDescription>
                          Reviewed:{" "}
                          {new Date(record.reviewedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Reviewed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Original Symptoms:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{record.symptoms}</p>
                    </div>

                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Your Diagnosis:</h4>
                      <p className="text-green-700 mb-3">{record.diagnosis}</p>

                      {record.prescription && (
                        <div>
                          <h5 className="font-medium text-green-800 mb-1">Prescription:</h5>
                          <p className="text-green-700 mb-3">{record.prescription}</p>
                        </div>
                      )}

                      {record.notes && (
                        <div>
                          <h5 className="font-medium text-green-800 mb-1">Notes:</h5>
                          <p className="text-green-700">{record.notes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
