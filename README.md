# HealthCare Pro - Modern Healthcare Management System

A comprehensive healthcare management platform built with Next.js, featuring role-based dashboards for patients, doctors, and pharmacy staff.

## ✨ Features

### 🏥 **Unified Authentication**
- Single login/register interface with role selection
- JWT-based authentication
- Secure password hashing with bcrypt

### 👥 **Role-Based Dashboards**

#### 🩺 **Patient Portal**
- Submit detailed medical information via forms
- Track medical history and records
- View diagnoses and prescriptions
- Receive messages from healthcare staff

#### 👨‍⚕️ **Doctor Dashboard**
- Review pending patient submissions
- Provide diagnoses and prescriptions
- Track completed reviews
- Comprehensive patient information display

#### 💊 **Pharmacy Portal**
- Manage new prescriptions
- Dispense medications
- Track dispensed medications
- Send messages to patients

### 🎨 **Modern Design**
- Beautiful gradient backgrounds with glassmorphism
- Responsive design for all devices
- Smooth animations and transitions
- Professional healthcare-themed UI

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)

### Installation

1. **Extract and install dependencies:**
\`\`\`bash
npm install
\`\`\`

2. **Set up environment variables:**
\`\`\`bash
cp .env.local.example .env.local
\`\`\`
Edit `.env.local` with your MongoDB connection string:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-super-secure-jwt-secret-key
\`\`\`

3. **Initialize the database:**
\`\`\`bash
npm run setup-db
\`\`\`

4. **Start the development server:**
\`\`\`bash
npm run dev
\`\`\`

5. **Open your browser:**
Navigate to `http://localhost:3000`

## 🔐 Demo Credentials

After running the database setup, you can use these demo accounts:

- **Patient:** `patient@demo.com` / `demo123`
- **Doctor:** `doctor@demo.com` / `demo123`
- **Pharmacy:** `clerk@demo.com` / `demo123`

## 📱 How to Use

### For Patients:
1. Register or login as a patient
2. Fill out the comprehensive medical form
3. Submit symptoms, vital signs, and medical history
4. View your medical records and doctor responses
5. Receive messages from healthcare staff

### For Doctors:
1. Login as a doctor
2. Review pending patient submissions
3. Provide diagnoses and prescriptions
4. Track your completed reviews

### For Pharmacy Staff:
1. Login as a pharmacy clerk
2. View new prescriptions from doctors
3. Dispense medications to patients
4. Send messages to patients about their medications

## 🛠 Technical Stack

- **Frontend:** Next.js 14, React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui components
- **Backend:** Next.js API Routes
- **Database:** MongoDB
- **Authentication:** JWT tokens
- **Icons:** Lucide React

## 📁 Project Structure

\`\`\`
healthcare-app/
├── app/
│   ├── auth/           # Authentication pages
│   ├── patient/        # Patient dashboard
│   ├── doctor/         # Doctor dashboard
│   ├── clerk/          # Pharmacy dashboard
│   └── api/            # API routes
├── components/         # Reusable UI components
├── lib/               # Utility functions
└── scripts/           # Database setup scripts
\`\`\`

## 🔧 Configuration

### Database Collections:
- `users` - User accounts and authentication
- `patient_records` - Medical submissions and reviews
- `messages` - Communication between staff and patients

### Environment Variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

## 🚀 Deployment

### Vercel (Recommended):
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms:
1. Build the application: `npm run build`
2. Start production server: `npm start`
3. Ensure MongoDB is accessible from production

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation and sanitization
- Secure API endpoints

## 📈 Future Enhancements

- [ ] Email notifications
- [ ] Appointment scheduling
- [ ] File upload for medical documents
- [ ] Real-time chat system
- [ ] Admin dashboard
- [ ] Prescription history tracking
- [ ] Insurance integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions:
- Create an issue on GitHub
- Check the documentation
- Review the demo credentials above

---

**HealthCare Pro** - Streamlining healthcare management with modern technology! 🏥✨
