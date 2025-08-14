"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Shield, Users, Stethoscope, Pill, UserCheck } from "lucide-react"
import { toast } from "sonner"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        toast.success("Login successful!")

        // Redirect based on role
        switch (data.user.role) {
          case "patient":
            router.push("/patient/dashboard")
            break
          case "doctor":
            router.push("/doctor/dashboard")
            break
          case "clerk":
            router.push("/clerk/dashboard")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        toast.error(data.message || "Login failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Registration successful! Please login.")
        // Switch to login tab
        document.querySelector('[data-value="login"]')?.click()
      } else {
        toast.error(data.message || "Registration failed")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-red-500" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                HealthCare Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Shield className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Secure & Trusted</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900">
                Modern Healthcare
                <span className="block bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Management System
                </span>
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Streamline patient care, doctor consultations, and pharmacy operations in one integrated platform.
              </p>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Patients</h3>
                  <p className="text-sm text-blue-700">Submit medical forms</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Stethoscope className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Doctors</h3>
                  <p className="text-sm text-green-700">Review & diagnose</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <Pill className="h-8 w-8 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Pharmacy</h3>
                  <p className="text-sm text-purple-700">Dispense medications</p>
                </div>
              </div>
            </div>

            {/* Demo Credentials */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">🎯 Demo Credentials:</h4>
              <div className="text-sm text-yellow-700 space-y-1">
                <p>
                  <strong>Patient:</strong> patient@demo.com / demo123
                </p>
                <p>
                  <strong>Doctor:</strong> doctor@demo.com / demo123
                </p>
                <p>
                  <strong>Pharmacy:</strong> clerk@demo.com / demo123
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md bg-white/80 backdrop-blur-md border-white/20 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Welcome
                </CardTitle>
                <CardDescription>Sign in to your account or create a new one</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="login" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login" data-value="login">
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>

                  {/* Login Form */}
                  <TabsContent value="login">
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          value={loginData.email}
                          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          value={loginData.password}
                          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Register Form */}
                  <TabsContent value="register">
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={registerData.firstName}
                            onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={registerData.lastName}
                            onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="john@example.com"
                          value={registerData.email}
                          onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          value={registerData.password}
                          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          value={registerData.role}
                          onValueChange={(value) => setRegisterData({ ...registerData, role: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="patient">
                              <div className="flex items-center space-x-2">
                                <Users className="h-4 w-4 text-blue-600" />
                                <span>Patient</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="doctor">
                              <div className="flex items-center space-x-2">
                                <Stethoscope className="h-4 w-4 text-green-600" />
                                <span>Doctor</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="clerk">
                              <div className="flex items-center space-x-2">
                                <UserCheck className="h-4 w-4 text-purple-600" />
                                <span>Pharmacy Clerk</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating Account..." : "Create Account"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
