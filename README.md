# EventSphere Management — Full MERN Stack Event & Expo Platform

> Developed as a high-performance, enterprise-grade full-stack web application for convention organizers, corporate exhibitors, and trade summit delegates.

---

## 🌟 1. Project Overview

**EventSphere Management** is a full-featured MERN Stack web application designed to orchestrate large-scale trade expos, industrial exhibitions, and tech conferences.

The application combines a high-performance React.js frontend with an Express.js & MongoDB backend, featuring real-time WebSocket updates, JWT role-based access control, interactive SVG floor plan stall allocation, digital QR ticketing, and automated database seeding.

### Key Capabilities:
- **Interactive Spatial Floor Plan Engine**: Interactive SVG hall layout color-coded by occupancy status (`Available`, `Reserved`, `Booked`) with atomic double-booking prevention.
- **Turnstile Electronic Badges (QR E-Ticketing)**: Instant digital badge generation with high-density QR verification for swift attendee check-in.
- **Tri-Role RBAC Architecture**:
  1. **Admin / Organizer**: Complete convention oversight, expo creation, booth assignment, exhibitor approval, attendee check-in scanner, analytics, and messaging.
  2. **Exhibitor**: Company profile management, booth booking, product showcase, staff pass issuance, and space applications.
  3. **Attendee**: Expo registration, digital pass access, exhibitor directory, session agenda browsing, bookmarking, and feedback.
- **Real-Time WebSockets (Socket.IO)**: Instant live synchronization across connected browsers for stall reservations, schedule updates, notifications, and inquiries.
- **Secure Authentication**: Password hashing with bcrypt, JSON Web Tokens (JWT), input validation, rate limiting, and CORS security.
- **Persistent Database Engine**: Direct connection to local MongoDB or MongoDB Atlas via `.env`, ensuring consistent persistent data storage across restarts.

---

## 💻 2. Technology Stack

### Frontend:
- **React.js 18** (Modern functional components & hooks)
- **Vite 5** (Fast ES module bundler)
- **JavaScript (ES6+)**
- **Tailwind CSS 3** (Custom responsive design system)
- **React Router DOM 6** (Client-side routing with protected routes)
- **Axios** (Centralized API client with JWT interceptors)
- **Socket.IO Client** (Real-time WebSocket event listeners)
- **Recharts** (Interactive analytics charts)
- **Lucide React** (Consistent UI iconography)
- **React Hot Toast** (Notifications and alerts)
- **Framer Motion** (Smooth transitions and animations)

### Backend:
- **Node.js** (v18+ / v24+)
- **Express.js 4** (MVC REST API framework)
- **MongoDB & Mongoose 8** (Document database with validation & indexes)
- **JSON Web Tokens (JWT)** (Stateless authorization)
- **bcryptjs** (Password hashing with salt rounds)
- **Socket.IO 4** (Bidirectional real-time event broadcasting)
- **Multer** (Secure file upload handling for logos and documents)
- **Nodemailer** (SMTP email delivery with simulated local fallback)
- **Helmet & Express Rate Limit** (HTTP security headers and brute-force mitigation)
- **Morgan** (HTTP request logging)

---

## 📂 3. Project Structure

```text
EventSphere Management/
├── backend/                        # Complete Express.js & MongoDB Backend
│   ├── config/
│   │   └── db.js                   # Mongoose connection with zero-config fallback
│   ├── controllers/                # Business logic controllers
│   │   ├── analyticsController.js  # Dashboard KPIs, chart metrics, and aggregates
│   │   ├── applicationController.js# Exhibitor booth space applications
│   │   ├── authController.js       # Register, login, profile, forgot/reset password
│   │   ├── bookmarkController.js   # Personal agenda bookmarks
│   │   ├── boothController.js      # Stall allocation & double-booking prevention
│   │   ├── exhibitorController.js  # Profile, products, staff passes, file upload
│   │   ├── expoController.js       # Expo event CRUD & slug generation
│   │   ├── feedbackController.js   # Attendee reviews & ratings
│   │   ├── messageController.js    # Inquiries & threaded replies
│   │   ├── notificationController.js# Real-time user notifications
│   │   ├── registrationController.js# Expo passes, ticket numbers & QR data
│   │   ├── scheduleController.js   # Conference sessions & enrollment
│   │   └── userController.js       # User management (Admin)
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification & req.user attachment
│   │   ├── errorMiddleware.js      # Global error handler & 404 handler
│   │   ├── rateLimiter.js          # API & Auth rate limiting
│   │   ├── roleMiddleware.js       # Role-based access control (RBAC)
│   │   └── uploadMiddleware.js     # Multer file upload validation (10MB limit)
│   ├── models/                     # Mongoose Schema Definitions
│   │   ├── Application.js          # Exhibitor space applications
│   │   ├── Bookmark.js             # User session bookmarks
│   │   ├── Booth.js                # Hall stalls with compound indexes
│   │   ├── Exhibitor.js            # Exhibitor profiles, products & staff
│   │   ├── Expo.js                 # Expos, venues, themes & capacities
│   │   ├── Feedback.js             # Reviews & ratings
│   │   ├── Message.js              # Support inquiries & replies
│   │   ├── Notification.js         # Alerts & announcements
│   │   ├── Registration.js         # Attendee digital passes & check-in
│   │   ├── Schedule.js             # Conference sessions & speakers
│   │   └── User.js                 # User accounts with bcrypt hashing
│   ├── routes/                     # Express Router modules
│   │   ├── analyticsRoutes.js
│   │   ├── applicationRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookmarkRoutes.js
│   │   ├── boothRoutes.js
│   │   ├── exhibitorRoutes.js
│   │   ├── expoRoutes.js
│   │   ├── feedbackRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── scheduleRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   ├── emailService.js         # Nodemailer SMTP with simulated logging
│   │   └── socketService.js        # Socket.IO room subscriptions & broadcasts
│   ├── utils/
│   │   └── generateToken.js        # JWT signing utility
│   ├── uploads/                    # Directory for uploaded logos & documents
│   ├── .env                        # Active environment configuration
│   ├── .env.example                # Example environment template
│   ├── package.json                # Backend dependencies & scripts
│   ├── seed.js                     # Complete database seed script
│   ├── server.js                   # Express server entry point
│   └── test_api.js                 # Automated API test suite
│
├── src/                            # React.js Frontend
│   ├── components/
│   │   ├── charts/                 # Recharts visualization components
│   │   ├── common/                 # Buttons, Cards, Badges, Modals, FloorPlan
│   │   ├── forms/                  # Registration, Session, Booth modals
│   │   └── layout/                 # Sidebar, Header, DemoBanner
│   ├── context/
│   │   ├── AuthContext.jsx         # Live JWT authentication & session store
│   │   └── DataContext.jsx         # Live API state store & Socket.IO listeners
│   ├── data/
│   │   └── mockData.js             # Initial fallback data
│   ├── layouts/
│   │   ├── DashboardLayout.jsx     # Authenticated dashboard sidebar & header
│   │   └── PublicLayout.jsx        # Public website navigation & footer
│   ├── pages/
│   │   ├── admin/                  # 10 Admin management pages
│   │   ├── exhibitor/              # 8 Exhibitor management pages
│   │   ├── attendee/               # 8 Attendee pass & schedule pages
│   │   ├── auth/                   # Login, Register, Forgot Password
│   │   └── public/                 # Home, About, Expos, Schedule, Floor Plan, Contact
│   ├── routes/
│   │   └── AppRoutes.jsx           # Protected & public route definitions
│   ├── services/
│   │   ├── api.js                  # Axios client with interceptors
│   │   └── socket.js               # Socket.IO client connection
│   └── utils/
│       └── helpers.js              # Formatting & CSV export utilities
│
├── API_DOCUMENTATION.md            # Detailed REST API endpoints documentation
├── PROJECT_GUIDE.md                # Beginner-friendly code guide
├── README.md                       # Main documentation & run guide
└── package.json                    # Frontend dependencies & root scripts
```

---

## 🔑 4. Initial Admin Setup & Clean Database

The application is configured to connect to a **real, clean, persistent MongoDB database** without any automatic demo or sample data injection. When first launched with a fresh MongoDB database, the collections start completely empty.

### Creating the First Administrator Account
To securely initialize the first Administrator without exposing public Admin registration, run the dedicated setup command:

```bash
# Using root npm script:
npm run admin:create
```

#### Provisioning via Environment Variables
You can specify credentials directly in `backend/.env` or provide them when running the command:
```env
# Optional environment variables in backend/.env:
ADMIN_NAME=System Administrator
ADMIN_EMAIL=admin@eventsphere.com
ADMIN_PASSWORD=SecureAdminPassword123!
```

Or pass them inline:
```bash
ADMIN_NAME="System Administrator" ADMIN_EMAIL=admin@eventsphere.com ADMIN_PASSWORD=SecureAdminPassword123! npm run admin:create
```
*(If environment variables are omitted, the script safely prompts for the details in your terminal).*

This CLI command:
1. Connects directly to the real MongoDB instance defined in `backend/.env` (no in-memory fallback).
2. Hashes the password securely with `bcrypt` (10 salt rounds) using the User Mongoose model.
3. Creates a verified user with role `admin` (plain-text passwords are never stored).
4. Verifies if the email already exists — duplicate accounts are rejected and existing non-admin users are never silently promoted.
5. Guarantees that public registration via the web API is strictly restricted to `attendee` and `exhibitor` roles.

### Regular Users & Exhibitors
- **Attendees** and **Exhibitors** register directly through the web interface at `/register`.
- Public users cannot escalate to Admin.
- The database remains completely empty until real users or administrators create records.

*(Optional Development Note: `backend/seed.js` is retained strictly for optional manual development testing if ever needed via `node seed.js`, but is NEVER run automatically on server boot).*

---

## 🚀 5. Installation & Running Instructions

### Step 1: Open the Project Directory
Open your terminal (PowerShell, Command Prompt, or bash) in the project folder:
```bash
cd "c:\Users\iT\Desktop\EventSphere Management"
```

### Step 2: Install Dependencies
Run the install command for both the frontend and backend:
```bash
npm install
cd backend && npm install && cd ..
```

### Step 3: Configure Environment Variables
A configured `.env` file is already provided inside `backend/`. If you want to customize it, copy `.env.example`:
```bash
cp backend/.env.example backend/.env
```

Configuration Options in `backend/.env`:
```env
PORT=5000
NODE_ENV=development
# For local MongoDB:
MONGODB_URI=mongodb://127.0.0.1:27017/eventsphere
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/eventsphere?retryWrites=true&w=majority
JWT_SECRET=eventsphere_super_secure_jwt_secret_key_2026_xyz
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```
*(Note: Ensure your MongoDB server is running locally or provide a MongoDB Atlas connection string in `backend/.env` for persistent data storage. If MongoDB is unreachable, the backend server safely stops with a descriptive connection error rather than falling back to in-memory mocks.)*

### Step 4: Create the Initial Administrator Account
Before launching the platform for the first time, generate your secure Admin credentials:
```bash
npm run admin:create
```
*(You can specify `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in `backend/.env`, pass them via environment variables, or enter them when prompted).*

### Step 5: Start the Backend & Frontend Servers
You can run both servers in two separate terminal windows:

**Terminal 1 (Backend API & Socket.IO Server):**
```bash
npm run server
```
*Backend runs on: `http://localhost:5000`*

**Terminal 2 (Frontend React Vite Application):**
```bash
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

Open your browser and navigate to: **`http://localhost:3000`**

---

## 🧪 6. Testing Instructions

An automated test script is included to test all major API capabilities, authentication, database persistence, and double-booking prevention:

```bash
cd backend
node test_api.js
```

### What this test verifies:
1. `GET /api/health`: Confirms server health.
2. `POST /api/auth/login`: Admin, Exhibitor, and Attendee authentication with bcrypt verification and JWT generation.
3. `GET /api/expos`: Retrieval of expos from MongoDB.
4. `GET /api/booths`: Retrieval of booth occupancy.
5. **Double-Booking Prevention Test**: Books booth `A-103` for NexusTech Solutions, then attempts to book the *same* booth concurrently for another exhibitor. Verifies that the second attempt is rejected with HTTP `409 Conflict`.
6. `GET /api/analytics/overview`: Admin metrics and calculated revenues.
7. `POST /api/registrations`: Dynamic pass creation with digital ticket numbers.

---

## 💾 7. Database Export & Backup Instructions

### Option A: Using `mongodump` & `mongorestore` (Standard MongoDB CLI)
If you have MongoDB Database Tools installed:

1. **Backup / Export Database:**
   ```bash
   mongodump --db=eventsphere --out=./backup
   ```
2. **Restore Database:**
   ```bash
   mongorestore --db=eventsphere ./backup/eventsphere
   ```

### Option B: Exporting Collections as JSON
```bash
mongoexport --db=eventsphere --collection=expos --out=expos.json --jsonArray
mongoexport --db=eventsphere --collection=booths --out=booths.json --jsonArray
mongoexport --db=eventsphere --collection=registrations --out=registrations.json --jsonArray
```

### Option C: Optional Development Reset / Demo Seed
If testing during development, you can optionally populate demo data using:
```bash
npm run server:seed
```
*(Never runs automatically — the database stays pristine unless this command is manually executed).*

---

## 🛡️ 8. Security & Best Practices

1. **Password Encryption**: All passwords hashed using `bcryptjs` with 10 salt rounds. Plaintext passwords never hit the database.
2. **JWT Route Protection**: Token verified via `protect` middleware. Invalid or expired tokens return HTTP 401.
3. **Role-Based Access Control (RBAC)**: `authorize('admin')` restricts privileged actions (creating expos, approving exhibitors, changing booth status) strictly to Admin accounts.
4. **Rate Limiting**: `express-rate-limit` prevents brute-force login attempts (30 requests per 15 minutes on auth routes).
5. **HTTP Security Headers**: `helmet()` secures HTTP headers against clickjacking, sniffing, and cross-site scripting.
6. **CORS Restrictions**: Configured to restrict origin requests according to `CLIENT_URL`.

---

## 📄 9. License

© 2026 EventSphere Management. All rights reserved.
