"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Shield, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">HealthCare Portal</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-blue-600">
                Contact
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Your Health, Our Priority</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with healthcare professionals, manage your medical records, and get the care you need through our
            comprehensive healthcare management system.
          </p>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Patient Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Patient Portal</CardTitle>
                <CardDescription>
                  Submit medical information, view your records, and communicate with healthcare providers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/patient/login">
                  <Button className="w-full">Patient Login</Button>
                </Link>
                <Link href="/patient/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register as Patient
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Doctor Portal</CardTitle>
                <CardDescription>Review patient records, provide diagnoses, and prescribe medications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/doctor/login">
                  <Button className="w-full bg-green-600 hover:bg-green-700">Doctor Login</Button>
                </Link>
                <Link href="/doctor/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register as Doctor
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Clerk Portal */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Clock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Pharmacy Clerk</CardTitle>
                <CardDescription>
                  Manage prescriptions, dispense medications, and communicate with patients
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/clerk/login">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">Clerk Login</Button>
                </Link>
                <Link href="/clerk/register">
                  <Button variant="outline" className="w-full bg-transparent">
                    Register as Clerk
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">Comprehensive Healthcare Management</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Patient Records</h4>
              <p className="text-gray-600">Secure digital medical records accessible anytime</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Doctor Reviews</h4>
              <p className="text-gray-600">Professional medical consultations and diagnoses</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Prescription Management</h4>
              <p className="text-gray-600">Efficient medication dispensing and tracking</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Communication</h4>
              <p className="text-gray-600">Seamless messaging between all parties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="h-6 w-6" />
                <span className="text-lg font-semibold">HealthCare Portal</span>
              </div>
              <p className="text-gray-400">
                Providing comprehensive healthcare management solutions for patients, doctors, and pharmacy staff.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/patient/login" className="hover:text-white">
                    Patient Login
                  </Link>
                </li>
                <li>
                  <Link href="/doctor/login" className="hover:text-white">
                    Doctor Login
                  </Link>
                </li>
                <li>
                  <Link href="/clerk/login" className="hover:text-white">
                    Clerk Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contact Info</h5>
              <p className="text-gray-400">
                Email: support@healthcareportal.com
                <br />
                Phone: (555) 123-4567
                <br />
                Address: 123 Healthcare Ave, Medical City
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 HealthCare Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
