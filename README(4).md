# HirePro

> **Hire trusted professionals, anytime, anywhere.**

HirePro is a full-stack MERN service marketplace that helps customers find and hire skilled professionals for their everyday needs. Users can browse different services, explore professional profiles, check their skills and experience, book services, manage their bookings, make online payments, and share reviews. Professionals can create their profiles, showcase their skills and experience, set their pricing and service areas, and manage booking requests. HirePro makes the process of finding and hiring reliable professionals simple, convenient, and organized.

## 🌐 Live Demo

**Frontend:** https://hire-pro-bice.vercel.app/

**Backend API:** https://hirepro-6yde.onrender.com/

**Health Check:** https://hirepro-6yde.onrender.com/api/v1/health

---

## 📌 Why HirePro?

Finding a reliable professional for a specific task can be difficult. People often depend on personal contacts, local references, WhatsApp groups, or social media.

HirePro provides a centralized marketplace where customers can discover suitable professionals based on their service, location, pricing, experience, and reviews.

Services can include:

- 🚗 Drivers
- 🔧 Plumbers
- ⚡ Electricians
- 🛠️ Mechanics
- 💻 Developers
- 🎨 Tutors
- 🧹 Cleaners
- 📸 Photographers
- 🏠 Decorators
- And other skilled professionals

---

## => Key Features

### 👤 Authentication
- User registration and login
- Login using email or username
- JWT-based authentication
- Password hashing with bcrypt
- Access and refresh tokens
- Cookie-based authentication
- Protected routes
- Logout

### 👨‍💼 Professional Marketplace
- Professional profiles
- Profession, skills and experience
- Pricing and service areas
- Professional bio
- Profile/avatar support
- Portfolio images
- Professional dashboard

### 🔎 Services & Discovery
- Browse services
- Explore professionals
- Category-based discovery
- Service and pricing information
- Responsive service cards

### 📅 Booking System
- Create bookings
- View and manage bookings
- Booking details
- Booking cancellation
- Professional booking management
- Accept/reject booking requests

### ⭐ Reviews & Ratings
- Customer reviews
- Professional ratings
- Review-based decision making

### 💳 Payments
- Razorpay integration
- Payment APIs
- Server-side payment verification
- Payment status handling

### 👤 Profile Management
- View profile
- Edit account information
- Change password
- Update profile picture
- Display role and account details

### 🌓 Theme Support
- Light mode
- Dark mode
- Persistent theme preference
- Theme-aware components

### 📱 Responsive UI
Designed for mobile, tablet, laptop and desktop screens.

---

## 🎨 UI Design

HirePro follows a clean, warm and premium marketplace-style interface.

- Minimal interface
- Premium card-based layout
- Soft rounded corners
- Smooth shadows
- Plenty of whitespace
- Subtle hover animations
- Clean typography
- Consistent 8px spacing approach
- Responsive layouts
- Soft professional color palette

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- CORS

### Payments
- Razorpay

### Database
- MongoDB Atlas

### Deployment
- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

### Tools
- Git
- GitHub
- VS Code
- npm
- Nodemon

---

## 🏗️ Project Structure

```text
HirePro/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🔐 Authentication Flow

```text
User
  ↓
Register / Login
  ↓
Express Authentication API
  ↓
MongoDB
  ↓
JWT Access + Refresh Tokens
  ↓
Authenticated Requests
```

Protected backend routes verify the authenticated user before allowing access.

---

## 🔄 Booking Flow

```text
Customer
   ↓
Browse Services
   ↓
Select Professional
   ↓
View Professional Details
   ↓
Create Booking
   ↓
Professional Receives Request
   ↓
Accept / Reject
   ↓
Service Completion
   ↓
Payment
   ↓
Review & Rating
```

---

## 💳 Payment Flow

```text
Customer
   ↓
Create Booking
   ↓
Initiate Payment
   ↓
Razorpay
   ↓
Payment Verification
   ↓
Backend
   ↓
Update Payment Status
```

Sensitive payment credentials are stored through environment variables.

---

## ⚙️ Environment Variables

Create a `.env` file inside `backend`.

```env
PORT=8000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=hirepro

CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=your_access_token_expiry

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=your_refresh_token_expiry

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> Never commit `.env` or real secret values to GitHub.

---

## 🚀 Run Locally

### Clone

```bash
git clone https://github.com/shashank1049/HirePro.git
cd HirePro
```

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend:

```text
http://localhost:8000
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔗 API Base URL

Local:

```text
http://localhost:8000/api/v1
```

Production:

```text
https://hirepro-6yde.onrender.com/api/v1
```

---

## 🩺 Health Check

```http
GET /api/v1/health
```

Production:

https://hirepro-6yde.onrender.com/api/v1/health

Expected response:

```json
{
  "success": true,
  "message": "HirePro API is running"
}
```

---

## 📡 Main API Modules

```text
/api/v1/auth
/api/v1/professional
/api/v1/service
/api/v1/booking
/api/v1/review
/api/v1/payment
```

The backend is organized into separate modules to keep authentication, professionals, services, bookings, reviews, and payments maintainable.

---

## 🧑‍💻 User Roles

### Customer
- Browse services
- Find professionals
- View professional profiles
- Create bookings
- Manage bookings
- Make payments
- Submit reviews
- Manage profile

### Professional
- Create professional profile
- Add skills and experience
- Define pricing
- Add service areas
- Manage bookings
- Accept/reject requests
- Showcase work

### Admin
The architecture supports an admin role for future platform management and moderation.

---

## 🔒 Security

Security considerations include:

- bcrypt password hashing
- JWT authentication
- Protected API routes
- HTTP-only cookies
- CORS configuration
- Environment variables for secrets
- Server-side payment verification
- Input validation
- Centralized error handling

> Never store database credentials, JWT secrets, Razorpay secrets, or other private credentials directly in source code.

---

## 📈 Future Improvements

- 🔎 Advanced professional search
- 📍 Maps integration
- 💬 Real-time chat
- 🔔 Real-time notifications
- 📱 OTP verification
- ❤️ Favorite professionals
- 📊 Professional analytics
- 🛡️ Admin dashboard
- 🤖 AI-powered recommendations
- 📅 Availability scheduling
- 💰 Wallet and refund management
- 📄 Invoice generation
- 🌐 Multi-language support
- 📱 Progressive Web App support

---

## 📸 Screenshots

Screenshots can be added as the UI evolves.

```text
docs/
└── screenshots/
    ├── home.png
    ├── services.png
    ├── professional.png
    ├── booking.png
    └── profile.png
```

Example:

```md
![HirePro Home](docs/screenshots/home.png)
```

---

## 🧪 Testing Checklist

### Authentication
- [ ] Register with email
- [ ] Register with username
- [ ] Login with email
- [ ] Login with username
- [ ] Invalid credentials
- [ ] Logout
- [ ] Protected routes

### Services
- [ ] View services
- [ ] View professionals
- [ ] Category filtering
- [ ] Professional details

### Bookings
- [ ] Create booking
- [ ] View bookings
- [ ] View booking details
- [ ] Cancel booking
- [ ] Accept/reject booking

### Profile
- [ ] View profile
- [ ] Edit profile
- [ ] Change password
- [ ] Update avatar

### Payments
- [ ] Create payment
- [ ] Test payment
- [ ] Verify payment
- [ ] Handle failed payment

### UI
- [ ] Light mode
- [ ] Dark mode
- [ ] Mobile layout
- [ ] Tablet layout
- [ ] Desktop layout

---

## 🌍 Deployment

### Frontend

Deployed using Vercel.

**Production:**  
https://hire-pro-bice.vercel.app/

### Backend

Deployed using Render.

**Production API:**  
https://hirepro-6yde.onrender.com/

### Database

MongoDB Atlas is used for cloud database hosting.

---

## 📂 Repository

GitHub:

https://github.com/shashank1049/HirePro

---

## 👨‍💻 Developer

**Shashank Mishra**

B.Tech — Artificial Intelligence & Machine Learning

**GitHub:**  
https://github.com/shashank1049

**LinkedIn:**  
https://www.linkedin.com/in/shashankmishra221

---

## 📄 License

This project is currently developed as a learning and portfolio project.

You are free to study the code and use it for educational purposes.

---

## ⭐ Support

If you find HirePro useful, consider giving the repository a ⭐ on GitHub.

---

**Built with React, Node.js, Express, MongoDB and a lot of debugging. 🚀**
