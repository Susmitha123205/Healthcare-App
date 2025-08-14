# Healthcare Application - Complete Implementation Guide

## 📋 Prerequisites

Before starting, ensure you have:
- **Node.js** (version 18 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** (for version control)
- **Code Editor** (VS Code recommended)

## 🚀 Step 1: Project Setup

### 1.1 Extract and Navigate
\`\`\`bash
# Extract the ZIP file to your desired location
# Navigate to the project directory
cd healthcareapp3
\`\`\`

### 1.2 Install Dependencies
\`\`\`bash
# Install all required packages
npm install
\`\`\`

## 🔧 Step 2: Environment Configuration

### 2.1 Create Environment File
Create a `.env.local` file in the root directory:

\`\`\`env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/healthcare_app
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare_app

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure

# Application URLs
FRONTEND_URL=http://localhost:3000
PORT=3000

# Security (Optional)
NODE_ENV=development
\`\`\`

### 2.2 Generate JWT Secret
\`\`\`bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
\`\`\`

## 🗄️ Step 3: Database Setup

### 3.1 Local MongoDB Setup
\`\`\`bash
# Start MongoDB service (Windows)
net start MongoDB

# Start MongoDB service (macOS/Linux)
sudo systemctl start mongod
# OR
brew services start mongodb-community
\`\`\`

### 3.2 Initialize Database
\`\`\`bash
# Run the database setup script
npm run setup-db
\`\`\`

## 🏃‍♂️ Step 4: Run the Application

### 4.1 Development Mode
\`\`\`bash
# Start the development server
npm run dev
\`\`\`

### 4.2 Production Mode
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

## 🧪 Step 5: Test Complete Workflow

### 5.1 Access the Application
Open your browser and navigate to: `http://localhost:3000`

### 5.2 Test Authentication Flow

**Register Users:**
1. **Patient Registration**
   - Go to `/patient/register`
   - Fill: Name, Email, Password, Phone, Address, Emergency Contact
   - Click "Register"

2. **Doctor Registration**
   - Go to `/doctor/register`
   - Fill: Name, Email, Password, Specialization, License Number
   - Click "Register"

3. **Clerk Registration**
   - Go to `/clerk/register`
   - Fill: Name, Email, Password, Department
   - Click "Register"

**Test Login:**
- Use registered credentials to login to respective dashboards
- Verify role-based access control

### 5.3 Test Complete Patient → Doctor → Clerk Workflow

**Step 1: Patient Submits Medical Record**
1. Login as Patient
2. Go to "Submit Information" tab
3. Fill medical form:
   - Symptoms: "Fever, headache"
   - Blood Pressure: "120/80"
   - Heart Rate: "75"
   - Temperature: "101.5"
   - Weight: "70"
   - Height: "175"
   - Age: "30"
   - Emergency Contact: "John Doe - 123-456-7890"
4. Submit form
5. Verify record appears in "Medical History" with "pending" status

**Step 2: Doctor Reviews and Prescribes**
1. Login as Doctor
2. Verify patient record appears in "Pending Reviews"
3. Click "Review" on the patient record
4. Add diagnosis: "Viral fever"
5. Add prescription: "Paracetamol 500mg, 3 times daily for 5 days"
6. Submit review
7. Verify record moves to "Reviewed Cases"

**Step 3: Clerk Manages Prescription**
1. Login as Clerk
2. Verify prescription appears in clerk dashboard
3. Click "Dispense" on the prescription
4. Add message: "Medication ready for pickup"
5. Mark as dispensed

**Step 4: Patient Receives Updates**
1. Login as Patient
2. Verify record status changed to "reviewed"
3. Check "Messages" tab for clerk communication
4. Check "Notifications" for prescription updates

## 🔍 Step 6: Verification Checklist

### Authentication System
- [ ] Patient registration works
- [ ] Doctor registration works  
- [ ] Clerk registration works
- [ ] Login redirects to correct dashboards
- [ ] Logout functionality works
- [ ] Protected routes require authentication

### Patient Dashboard
- [ ] Medical record submission form works
- [ ] Submitted records appear in history
- [ ] Record status updates (pending → reviewed)
- [ ] Messages from clerk are visible
- [ ] Notifications appear for prescription updates

### Doctor Dashboard
- [ ] Pending patient records are visible
- [ ] Doctor can review and add diagnosis
- [ ] Doctor can add prescriptions
- [ ] Reviewed cases are tracked
- [ ] Patient information is complete

### Clerk Dashboard
- [ ] Prescriptions from doctors appear
- [ ] Clerk can dispense medications
- [ ] Clerk can send messages to patients
- [ ] Dispensed medications are tracked

## 🐛 Step 7: Troubleshooting

### Common Issues and Solutions

**Database Connection Issues:**
\`\`\`bash
# Check MongoDB is running
mongosh
# OR
mongo

# If connection fails, restart MongoDB service
\`\`\`

**Port Already in Use:**
\`\`\`bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 npm run dev
\`\`\`

**JWT Token Issues:**
- Ensure JWT_SECRET is set in .env.local
- Clear browser localStorage and cookies
- Re-login to generate new tokens

**API Route Errors:**
- Check browser console for detailed errors
- Verify all environment variables are set
- Ensure MongoDB is running and accessible

### Debug Mode
\`\`\`bash
# Run with debug logging
DEBUG=* npm run dev
\`\`\`

## 📱 Step 8: Demo Preparation

### 8.1 Create Demo Data
\`\`\`bash
# Run demo data script (if available)
npm run seed-demo
\`\`\`

### 8.2 Demo Script
1. **Show Homepage** - Explain three role portals
2. **Register Demo Users** - Create one user for each role
3. **Patient Flow** - Submit medical record
4. **Doctor Flow** - Review and prescribe
5. **Clerk Flow** - Dispense medication
6. **Patient Update** - Show received prescription

### 8.3 Key Features to Highlight
- **Role-based Authentication** - Secure login system
- **Complete Workflow** - End-to-end patient care process
- **Real-time Updates** - Status changes across dashboards
- **Data Security** - Encrypted passwords, JWT tokens
- **User Experience** - Intuitive interfaces for each role

## 🚀 Step 9: Deployment (Optional)

### 9.1 Vercel Deployment
\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Set environment variables in Vercel dashboard
\`\`\`

### 9.2 MongoDB Atlas Setup
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update MONGODB_URI in environment variables

## ✅ Final Checklist

Before presenting to your supervisor:

- [ ] Application runs without errors
- [ ] All three user roles can register and login
- [ ] Complete workflow tested (Patient → Doctor → Clerk → Patient)
- [ ] Database is properly connected
- [ ] All environment variables are configured
- [ ] Demo data is prepared
- [ ] Application is responsive and user-friendly

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure environment variables are correctly set
4. Check MongoDB connection and service status

Your healthcare application is now ready for demonstration!
