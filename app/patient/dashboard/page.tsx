"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, FileText, MessageSquare, Clock, CheckCircle, AlertCircle, LogOut } from "lucide-react"
import { toast } from "sonner"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
}

interface PatientRecord {
  _id: string
  symptoms: string
  painLevel: number
  temperature: string
  bloodPressure: string
  heartRate: string
  weight: string
  medicalHistory: string
  allergies: string
  currentMedications: string
  additionalNotes: string
  status: string
  diagnosis?: string
  prescription?: string
  doctorNotes?: string
  createdAt: string
}

interface Message {
  _id: string
  content: string
  sender: string
  senderRole: string
  createdAt: string
  read: boolean
}

export default function PatientDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    symptoms: "",
    painLevel: 1,
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    weight: "",
    medicalHistory: "",
    allergies: "",
    currentMedications: "",
    additionalNotes: "",
  })

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "patient") {
      router.push("/")
      return
    }

    setUser(parsedUser)
    fetchRecords()
    fetchMessages()
  }, [router])

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/patient/records", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setRecords(data.records)
      }
    } catch (error) {
      console.error("Error fetching records:", error)
    }
  }

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/patient/messages", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/patient/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success("Medical form submitted successfully!")
        setFormData({
          symptoms: "",
          painLevel: 1,
          temperature: "",
          bloodPressure: "",
          heartRate: "",
          weight: "",
          medicalHistory: "",
          allergies: "",
          currentMedications: "",
          additionalNotes: "",
        })
        fetchRecords()
      } else {
        const data = await response.json()
        toast.error(data.message || "Failed to submit form")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewed":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "reviewed":
        return <AlertCircle className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Heart className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Patient Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome, {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="submit" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="submit">Submit Medical Form</TabsTrigger>
            <TabsTrigger value="records">My Records</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
          </TabsList>

          {/* Submit Form Tab */}
          <TabsContent value="submit">
            <Card className="bg-white/80 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Medical Information Form</span>
                </CardTitle>
                <CardDescription>Please fill out your current medical information for doctor review</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Current Symptoms */}
                  <div className="space-y-2">
                    <Label htmlFor="symptoms">Current Symptoms *</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe your current symptoms in detail..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      required
                      rows={3}
                    />
                  </div>

                  {/* Pain Level */}
                  <div className="space-y-2">
                    <Label htmlFor="painLevel">Pain Level (1-10)</Label>
                    <Select
                      value={formData.painLevel.toString()}
                      onValueChange={(value) => setFormData({ ...formData, painLevel: Number.parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                          <SelectItem key={level} value={level.toString()}>
                            {level} -{" "}
                            {level <= 3 ? "Mild" : level <= 6 ? "Moderate" : level <= 8 ? "Severe" : "Extreme"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Vital Signs */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        placeholder="98.6"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bloodPressure">Blood Pressure</Label>
                      <Input
                        id="bloodPressure"
                        placeholder="120/80"
                        value={formData.bloodPressure}
                        onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="heartRate"
                        placeholder="72"
                        value={formData.heartRate}
                        onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        placeholder="150"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="space-y-2">
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Previous surgeries, chronic conditions, family history..."
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      rows={3}
                    />
                  </div>

                  {/* Allergies */}
                  <div className="space-y-2">
                    <Label htmlFor="allergies">Allergies</Label>
                    <Input
                      id="allergies"
                      placeholder="Food allergies, drug allergies, environmental allergies..."
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    />
                  </div>

                  {/* Current Medications */}
                  <div className="space-y-2">
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      placeholder="List all medications you are currently taking..."
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      placeholder="Any additional information you'd like to share..."
                      value={formData.additionalNotes}
                      onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Medical Form"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records">
            <div className="space-y-4">
              {records.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-md border-white/20">
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No medical records found. Submit your first form to get started.</p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record._id} className="bg-white/80 backdrop-blur-md border-white/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          Medical Record - {new Date(record.createdAt).toLocaleDateString()}
                        </CardTitle>
                        <Badge className={`${getStatusColor(record.status)} flex items-center space-x-1`}>
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Symptoms</h4>
                          <p className="text-gray-700">{record.symptoms}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Pain Level</h4>
                          <p className="text-gray-700">{record.painLevel}/10</p>
                        </div>
                      </div>

                      {record.diagnosis && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-green-900 mb-2">Doctor's Diagnosis</h4>
                          <p className="text-green-800">{record.diagnosis}</p>
                        </div>
                      )}

                      {record.prescription && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-blue-900 mb-2">Prescription</h4>
                          <p className="text-blue-800">{record.prescription}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <div className="space-y-4">
              {messages.length === 0 ? (
                <Card className="bg-white/80 backdrop-blur-md border-white/20">
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No messages yet. Your healthcare team will send updates here.</p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((message) => (
                  <Card key={message._id} className="bg-white/80 backdrop-blur-md border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={message.senderRole === "doctor" ? "default" : "secondary"}>
                            {message.senderRole === "doctor" ? "Doctor" : "Pharmacy"}
                          </Badge>
                          <span className="text-sm text-gray-600">{new Date(message.createdAt).toLocaleString()}</span>
                        </div>
                        {!message.read && (
                          <Badge variant="destructive" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-800">{message.content}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
