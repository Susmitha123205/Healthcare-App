"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Pill, Package, MessageSquare, LogOut, User, Clock, CheckCircle } from "lucide-react"

export default function ClerkDashboard() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("prescriptions")
  const [prescriptions, setPrescriptions] = useState([])
  const [dispensedMeds, setDispensedMeds] = useState([])
  const [messageData, setMessageData] = useState({
    patientId: "",
    message: "",
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
    if (parsedUser.role !== "clerk") {
      router.push("/auth/login")
      return
    }

    setUser(parsedUser)
    fetchPrescriptions()
    fetchDispensedMeds()
  }, [])

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/clerk/prescriptions", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setPrescriptions(data.prescriptions || [])
      }
    } catch (error) {
      console.error("Error fetching prescriptions:", error)
    }
  }

  const fetchDispensedMeds = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/clerk/dispensed", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setDispensedMeds(data.dispensed || [])
      }
    } catch (error) {
      console.error("Error fetching dispensed medications:", error)
    }
  }

  const handleDispense = async (recordId: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/clerk/dispense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ recordId }),
      })

      if (response.ok) {
        alert("Medication dispensed successfully!")
        fetchPrescriptions()
        fetchDispensedMeds()
      } else {
        alert("Failed to dispense medication")
      }
    } catch (error) {
      alert("Failed to dispense medication")
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (patientId: string, message: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/clerk/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ patientId, message }),
      })

      if (response.ok) {
        alert("Message sent successfully!")
        setMessageData({ patientId: "", message: "" })
      } else {
        alert("Failed to send message")
      }
    } catch (error) {
      alert("Failed to send message")
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg mr-3">
                <Pill className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pharmacy Dashboard</h1>
                <p className="text-sm text-gray-600">
                  {user.firstName} {user.lastName} - Pharmacy Clerk
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
                <div className="p-3 bg-orange-100 rounded-full">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Dispensed Today</p>
                  <p className="text-2xl font-bold text-gray-900">{dispensedMeds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Package className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{prescriptions.length + dispensedMeds.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-md p-1 rounded-lg shadow-sm mb-8">
          <button
            onClick={() => setActiveTab("prescriptions")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "prescriptions"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <Pill className="w-4 h-4 mr-2" />
            New Prescriptions ({prescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab("dispensed")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "dispensed"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Dispensed ({dispensedMeds.length})
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-md text-sm font-medium transition-all ${
              activeTab === "messages"
                ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md"
                : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
            }`}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Message
          </button>
        </div>

        {/* New Prescriptions Tab */}
        {activeTab === "prescriptions" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">New Prescriptions to Dispense</h2>

            {prescriptions.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <Pill className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No new prescriptions.</p>
                  <p className="text-gray-400 mt-2">New prescriptions from doctors will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              prescriptions.map((record: any, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <User className="w-5 h-5 mr-2 text-purple-600" />
                          {record.patientName}
                        </CardTitle>
                        <CardDescription>
                          Prescribed:{" "}
                          {new Date(record.reviewedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Ready to Dispense
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Doctor's Diagnosis:</h4>
                      <p className="text-blue-700 mb-3">{record.diagnosis}</p>

                      <h4 className="font-semibold text-blue-800 mb-2">Prescription:</h4>
                      <p className="text-blue-700 font-medium text-lg">{record.prescription}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Original Symptoms:</h4>
                      <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{record.symptoms}</p>
                    </div>

                    <Button
                      onClick={() => handleDispense(record._id)}
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                    >
                      {loading ? "Dispensing..." : "Mark as Dispensed"}
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Dispensed Medications Tab */}
        {activeTab === "dispensed" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Dispensed Medications</h2>

            {dispensedMeds.length === 0 ? (
              <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                <CardContent className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No dispensed medications yet.</p>
                  <p className="text-gray-400 mt-2">Dispensed prescriptions will appear here.</p>
                </CardContent>
              </Card>
            ) : (
              dispensedMeds.map((record: any, index) => (
                <Card key={index} className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          <User className="w-5 h-5 mr-2 text-purple-600" />
                          {record.patientName}
                        </CardTitle>
                        <CardDescription>
                          Dispensed:{" "}
                          {new Date(record.dispensedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        Dispensed
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Dispensed Medication:</h4>
                      <p className="text-green-700 font-medium text-lg">{record.prescription}</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Original Diagnosis:</h4>
                      <p className="text-blue-700">{record.diagnosis}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Send Message Tab */}
        {activeTab === "messages" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Send Message to Patient</h2>

            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Patient Communication
                </CardTitle>
                <CardDescription className="text-purple-100">
                  Send important information to patients about their medications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="patientSelect">Select Patient</Label>
                    <select
                      id="patientSelect"
                      value={messageData.patientId}
                      onChange={(e) => setMessageData({ ...messageData, patientId: e.target.value })}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">Choose a patient...</option>
                      {[...prescriptions, ...dispensedMeds].map((record: any, index) => (
                        <option key={index} value={record.patientId}>
                          {record.patientName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={messageData.message}
                      onChange={(e) => setMessageData({ ...messageData, message: e.target.value })}
                      placeholder="Enter your message to the patient..."
                      className="min-h-[120px]"
                    />
                  </div>

                  <Button
                    onClick={() => handleSendMessage(messageData.patientId, messageData.message)}
                    disabled={loading || !messageData.patientId || !messageData.message}
                    className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Message Templates */}
            <Card className="bg-white/80 backdrop-blur-md border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Quick Message Templates</CardTitle>
                <CardDescription>Click to use common pharmacy messages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setMessageData({
                        ...messageData,
                        message: "Your prescription is ready for pickup. Please bring a valid ID.",
                      })
                    }
                    className="text-left h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Prescription Ready</p>
                      <p className="text-sm text-gray-600">Standard pickup notification</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setMessageData({
                        ...messageData,
                        message:
                          "Please take your medication as prescribed by your doctor. If you have any questions, please contact us.",
                      })
                    }
                    className="text-left h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Medication Instructions</p>
                      <p className="text-sm text-gray-600">General medication guidance</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setMessageData({
                        ...messageData,
                        message:
                          "Your prescription will expire soon. Please contact your doctor for a refill if needed.",
                      })
                    }
                    className="text-left h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Refill Reminder</p>
                      <p className="text-sm text-gray-600">Prescription expiration notice</p>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      setMessageData({
                        ...messageData,
                        message:
                          "We have a question about your prescription. Please call us at your earliest convenience.",
                      })
                    }
                    className="text-left h-auto p-4"
                  >
                    <div>
                      <p className="font-medium">Contact Request</p>
                      <p className="text-sm text-gray-600">Request patient callback</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
