"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Bell, MessageCircle } from "lucide-react"

interface PatientRecord {
  _id: string
  symptoms: string
  vitalSigns: {
    bloodPressure: string
    heartRate: string
    temperature: string
    weight: string
  }
  medicalHistory: string
  currentMedications: string
  submittedAt: string
  status: "pending" | "reviewed" | "prescribed"
  diagnosis?: string
  prescription?: string
  height?: string
  age?: string
  emergencyContact?: string
}

interface Message {
  _id: string
  fromRole: string
  fromName: string
  message: string
  sentAt: string
  read: boolean
}

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  createdAt: string
  read: boolean
}

export default function PatientDashboard() {
  const [user, setUser] = useState<any>(null)
  const [records, setRecords] = useState<PatientRecord[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    symptoms: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    weight: "",
    medicalHistory: "",
    currentMedications: "",
    height: "",
    age: "",
    emergencyContact: "",
  })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/patient/login")
      return
    }

    setUser(JSON.parse(userData))
    fetchRecords()
    fetchMessages()
    fetchNotifications()
  }, [])

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
      console.error("Failed to fetch records:", error)
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
      console.error("Failed to fetch messages:", error)
    }
  }

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/patient/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markMessageAsRead = async (messageId: string) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`/api/patient/messages/${messageId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchMessages()
    } catch (error) {
      console.error("Failed to mark message as read:", error)
    }
  }

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`/api/patient/notifications/${notificationId}/read`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchNotifications()
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

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
        alert("Medical information submitted successfully!")
        setFormData({
          symptoms: "",
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          weight: "",
          medicalHistory: "",
          currentMedications: "",
          height: "",
          age: "",
          emergencyContact: "",
        })
        fetchRecords()
      } else {
        alert("Failed to submit information")
      }
    } catch (error) {
      alert("Failed to submit information")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) return <div>Loading...</div>

  const unreadMessages = messages.filter((m) => !m.read).length
  const unreadNotifications = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
            <p className="text-gray-600">
              Welcome, {user.firstName} {user.lastName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {unreadNotifications > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <Bell className="w-3 h-3" />
                  {unreadNotifications}
                </Badge>
              )}
              {unreadMessages > 0 && (
                <Badge variant="default" className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {unreadMessages}
                </Badge>
              )}
            </div>
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="submit" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="submit">Submit Information</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="messages">
              Messages {unreadMessages > 0 && <Badge className="ml-1">{unreadMessages}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications {unreadNotifications > 0 && <Badge className="ml-1">{unreadNotifications}</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Submit Medical Information</CardTitle>
                <CardDescription>
                  Please provide your current symptoms and vital signs for doctor review
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="symptoms">Current Symptoms</Label>
                    <Textarea
                      id="symptoms"
                      placeholder="Describe your current symptoms in detail..."
                      value={formData.symptoms}
                      onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bloodPressure">Blood Pressure</Label>
                      <Input
                        id="bloodPressure"
                        placeholder="120/80"
                        value={formData.bloodPressure}
                        onChange={(e) => setFormData({ ...formData, bloodPressure: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                      <Input
                        id="heartRate"
                        placeholder="72"
                        value={formData.heartRate}
                        onChange={(e) => setFormData({ ...formData, heartRate: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="temperature">Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        placeholder="98.6"
                        value={formData.temperature}
                        onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (lbs)</Label>
                      <Input
                        id="weight"
                        placeholder="150"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="height">Height (ft/in)</Label>
                      <Input
                        id="height"
                        placeholder="5'8&quot;"
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        placeholder="25"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        placeholder="John Doe - 555-0123"
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="medicalHistory">Medical History</Label>
                    <Textarea
                      id="medicalHistory"
                      placeholder="Any relevant medical history, allergies, or conditions..."
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="currentMedications">Current Medications</Label>
                    <Textarea
                      id="currentMedications"
                      placeholder="List any medications you are currently taking..."
                      value={formData.currentMedications}
                      onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Medical Information"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Your Medical Records</h2>
              {records.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">
                      No medical records found. Submit your first record above.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                records.map((record) => (
                  <Card key={record._id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Medical Record - {new Date(record.submittedAt).toLocaleDateString()}
                          </CardTitle>
                          <CardDescription>
                            Submitted on {new Date(record.submittedAt).toLocaleString()}
                          </CardDescription>
                        </div>
                        <Badge
                          variant={
                            record.status === "pending"
                              ? "secondary"
                              : record.status === "reviewed"
                                ? "default"
                                : "destructive"
                          }
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Symptoms:</h4>
                        <p className="text-gray-700">{record.symptoms}</p>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <h5 className="font-medium">Blood Pressure:</h5>
                          <p>{record.vitalSigns.bloodPressure || "Not provided"}</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Heart Rate:</h5>
                          <p>{record.vitalSigns.heartRate || "Not provided"}</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Temperature:</h5>
                          <p>{record.vitalSigns.temperature || "Not provided"}</p>
                        </div>
                        <div>
                          <h5 className="font-medium">Weight:</h5>
                          <p>{record.vitalSigns.weight || "Not provided"}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium">Height:</h5>
                        <p>{record.height || "Not provided"}</p>
                      </div>

                      <div>
                        <h5 className="font-medium">Age:</h5>
                        <p>{record.age || "Not provided"}</p>
                      </div>

                      <div>
                        <h5 className="font-medium">Emergency Contact:</h5>
                        <p>{record.emergencyContact || "Not provided"}</p>
                      </div>

                      {record.diagnosis && (
                        <div>
                          <h4 className="font-semibold text-green-700">Doctor's Diagnosis:</h4>
                          <p className="text-gray-700">{record.diagnosis}</p>
                        </div>
                      )}

                      {record.prescription && (
                        <div>
                          <h4 className="font-semibold text-blue-700">Prescription:</h4>
                          <p className="text-gray-700">{record.prescription}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="messages">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Messages from Healthcare Staff</h2>
              {messages.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No messages yet.</p>
                  </CardContent>
                </Card>
              ) : (
                messages.map((message) => (
                  <Card key={message._id} className={!message.read ? "border-blue-500" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            From: {message.fromRole === "clerk" ? "Pharmacy Staff" : "Doctor"} - {message.fromName}
                          </CardTitle>
                          <CardDescription>Sent on {new Date(message.sentAt).toLocaleString()}</CardDescription>
                        </div>
                        {!message.read && <Badge variant="default">New</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{message.message}</p>
                      {!message.read && (
                        <Button
                          onClick={() => markMessageAsRead(message._id)}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          Mark as Read
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">System Notifications</h2>
              {notifications.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-gray-500">No notifications yet.</p>
                  </CardContent>
                </Card>
              ) : (
                notifications.map((notification) => (
                  <Card key={notification._id} className={!notification.read ? "border-orange-500" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{notification.title}</CardTitle>
                          <CardDescription>{new Date(notification.createdAt).toLocaleString()}</CardDescription>
                        </div>
                        {!notification.read && <Badge variant="destructive">New</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{notification.message}</p>
                      {!notification.read && (
                        <Button
                          onClick={() => markNotificationAsRead(notification._id)}
                          variant="outline"
                          size="sm"
                          className="mt-2"
                        >
                          Mark as Read
                        </Button>
                      )}
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
