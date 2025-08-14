#!/bin/bash

echo "🏥 Setting up Healthcare Application Demo..."

# Create demo users
echo "Creating demo users..."

# Patient demo user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Patient",
    "email": "patient@demo.com",
    "password": "demo123",
    "role": "patient",
    "phone": "123-456-7890",
    "address": "123 Main St, City, State",
    "emergencyContact": "Jane Doe - 098-765-4321"
  }'

# Doctor demo user  
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. Smith",
    "email": "doctor@demo.com", 
    "password": "demo123",
    "role": "doctor",
    "specialization": "General Medicine",
    "licenseNumber": "MD12345"
  }'

# Clerk demo user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mary Clerk",
    "email": "clerk@demo.com",
    "password": "demo123", 
    "role": "clerk",
    "department": "Pharmacy"
  }'

echo "✅ Demo users created successfully!"
echo "📋 Demo Credentials:"
echo "Patient: patient@demo.com / demo123"
echo "Doctor: doctor@demo.com / demo123" 
echo "Clerk: clerk@demo.com / demo123"
