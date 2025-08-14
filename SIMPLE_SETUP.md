# Healthcare App - Simple Setup Guide

## What You Need
1. **MongoDB** - Database for storing patient records
2. **Node.js** - To run the application

## Quick Setup Steps

### 1. Install MongoDB
**Option A: MongoDB Atlas (Cloud - Easiest)**
- Go to [mongodb.com/atlas](https://mongodb.com/atlas)
- Create free account and cluster
- Get connection string

**Option B: Local MongoDB**
\`\`\`bash
# Windows (with chocolatey)
choco install mongodb

# macOS (with homebrew)  
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu)
sudo apt install mongodb
sudo systemctl start mongodb
\`\`\`

### 2. Environment Setup
Create `.env.local` file:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/healthcare_app
# OR for Atlas: mongodb+srv://username:password@cluster.mongodb.net/healthcare_app
JWT_SECRET=your_secret_key_here_minimum_32_characters
FRONTEND_URL=http://localhost:3000
PORT=3000
\`\`\`

### 3. Install & Run
\`\`\`bash
npm install
npm run dev
\`\`\`

### 4. Test the Application
1. Go to `http://localhost:3000`
2. Register as Patient, Doctor, or Clerk
3. Test the workflow:
   - Patient submits medical info
   - Doctor reviews and prescribes
   - Clerk dispenses medication

## Core Files (Only 13 Essential Files)
- `app/page.tsx` - Homepage with role selection
- `app/layout.tsx` - App layout
- `patient/dashboard/page.tsx` - Patient interface
- `doctor/dashboard/page.tsx` - Doctor interface  
- `clerk/dashboard/page.tsx` - Clerk interface
- `patient/login/page.tsx` & `patient/register/page.tsx` - Patient auth
- `doctor/login/page.tsx` & `doctor/register/page.tsx` - Doctor auth
- `clerk/login/page.tsx` & `clerk/register/page.tsx` - Clerk auth
- `lib/mongodb.ts` - Database connection
- `lib/auth.ts` - Authentication utilities

## API Routes (13 endpoints)
- Authentication: `/api/auth/login`, `/api/auth/register`
- Patient: `/api/patient/submit`, `/api/patient/records`, `/api/patient/messages`, `/api/patient/notifications`
- Doctor: `/api/doctor/records`, `/api/doctor/review`
- Clerk: `/api/clerk/prescriptions`, `/api/clerk/dispense`, `/api/clerk/message`

That's it! Your healthcare app is ready with just the essentials.
