# EventSphere Management — Beginner-Friendly Project Guide

Welcome to the **EventSphere Management** project guide! This document explains how the entire MERN application is structured, how the pieces fit together, and what each file does in simple, clear language.

---

## 🧭 1. What is the MERN Stack?

MERN stands for four key technologies working together:

1. **M — MongoDB**: The database that stores all our data (Users, Expos, Stalls, Tickets, Messages) as JSON-like documents.
2. **E — Express.js**: The Node.js web framework that receives HTTP requests from the browser and sends back responses.
3. **R — React.js**: The frontend library that builds the interactive user interface, forms, dashboards, and charts.
4. **N — Node.js**: The JavaScript runtime that runs our backend server on your computer.

---

## 📂 2. Tour of the Folders

### Root Directory (`/`)
- `package.json`: Lists the frontend libraries (React, Tailwind CSS, Lucide icons, Axios, Socket.IO client) and running scripts.
- `vite.config.js`: Configuration for the Vite development server and production bundler.
- `tailwind.config.js`: Custom styling theme, brand colors (Navy, Deep Blue, Royal Blue, Purple), and typography.
- `README.md`: Main setup, installation, and run guide.
- `API_DOCUMENTATION.md`: Complete list of backend REST endpoints and socket events.

---

### Backend Directory (`/backend`)
The backend is organized using the professional **MVC (Model-View-Controller)** pattern:

- **`server.js`**: The main starting point of the backend. It starts the Express server, connects to MongoDB, starts Socket.IO for real-time messages, and mounts the API routes.
- **`config/db.js`**: Handles connecting to persistent MongoDB using the `MONGODB_URI` environment variable, ensuring data persists across restarts.
- **`models/`**: Defines the "shape" of data in MongoDB:
  - `User.js`: User accounts (email, hashed password, role, profile details).
  - `Expo.js`: Exhibition details (title, dates, city, venue, capacity, cover image).
  - `Exhibitor.js`: Company profile, logo, products, and booth staff.
  - `Booth.js`: Stalls on the floor plan (`A-101`, `B-201`), their status (`Available`, `Booked`), and price.
  - `Registration.js`: Attendee tickets, unique ticket numbers (`ESP-2026-XXXX`), and QR codes.
  - `Application.js`: Exhibitor applications requesting stalls.
  - `Schedule.js`: Conference sessions, speaker info, hall, and time.
  - `Message.js`: Inquiries and replies between users and organizers.
  - `Notification.js`: Real-time announcements and alerts.
  - `Feedback.js`: Visitor reviews and 1-5 star ratings.
  - `Bookmark.js`: Saved sessions for an attendee's personal schedule.
- **`controllers/`**: The "brains" containing the logic for each feature (e.g. `login`, `bookBooth`, `createExpo`).
- **`routes/`**: Connects URL paths (like `/api/auth/login`) to the correct controller functions.
- **`middleware/`**: Helper functions that run before controllers:
  - `authMiddleware.js`: Checks the JWT token to verify who is logged in.
  - `roleMiddleware.js`: Checks if the user is allowed to access that page (e.g. only Admins can create expos).
  - `uploadMiddleware.js`: Multer helper to accept image and PDF uploads into `backend/uploads/`.
  - `rateLimiter.js`: Protects the server from spam and brute-force attacks.
  - `errorMiddleware.js`: Catches errors and returns clean error messages.
- **`services/`**:
  - `socketService.js`: Manages real-time WebSockets so changes appear on other screens instantly without refreshing.
  - `emailService.js`: Sends password reset and ticket emails (simulated in console if SMTP is not set up).
- **`createAdmin.js`**: Standalone CLI script to create the initial Administrator account with bcrypt password hashing directly in MongoDB.
- **`seed.js`**: An optional development script to populate sample expos and booths if needed during local testing (never runs automatically).
- **`test_api.js`**: Automated script that tests all endpoints to ensure everything works properly.

---

### Frontend Directory (`/src`)
- **`main.jsx`**: The React entry point that mounts our app onto the HTML page.
- **`App.jsx`**: Wraps the app in the `AuthProvider`, `DataProvider`, and `BrowserRouter`.
- **`routes/AppRoutes.jsx`**: Defines every URL path in the web app (e.g. `/`, `/expos`, `/admin`, `/exhibitor`, `/attendee`).
- **`services/api.js`**: Centralized Axios client that talks to `http://localhost:5000/api` and automatically attaches the JWT token.
- **`services/socket.js`**: Connects to the backend Socket.IO server for real-time events.
- **`context/`**:
  - `AuthContext.jsx`: Holds the currently logged-in user and token. Provides `login`, `register`, and `logout`.
  - `DataContext.jsx`: Holds expos, exhibitors, booths, sessions, and messages in React state. Updates in real-time when WebSockets fire!
- **`pages/`**:
  - `public/`: Public website (Home, About, Explore Expos, Details, Exhibitors, Schedule, Floor Plan, Contact, FAQ).
  - `auth/`: Login, Register, Forgot Password.
  - `admin/`: 10 pages for Organizer management (Overview, Expos, Exhibitors, Booths, Schedule, Attendees, Analytics, Messages, Feedback, Settings).
  - `exhibitor/`: 8 pages for Exhibitors (Overview, Profile, Products, Applications, Booths, Staff, Messages, Settings).
  - `attendee/`: 8 pages for Attendees (Overview, My Passes, Directory, Schedule, Bookmarks, Notifications, Feedback, Settings).
- **`components/`**: Reusable UI blocks (Buttons, Cards, Badges, Modals, StatCards, Interactive Floor Plan, Charts).

---

## 🔄 3. How Data Flows in the Application

Here is a step-by-step example of what happens when a user books a booth:

1. **User Action**: An exhibitor clicks "Reserve Booth A-103" on the interactive floor plan.
2. **Component Call**: The component calls `bookBooth(boothId, exhibitorId)` from `DataContext`.
3. **Axios API Request**: `DataContext` calls `boothAPI.book(id)` in `src/services/api.js`.
4. **JWT Header**: Axios automatically adds `Authorization: Bearer <token>` from `localStorage`.
5. **Backend Route**: The request arrives at `POST /api/booths/:id/book` in `backend/routes/boothRoutes.js`.
6. **Auth Middleware**: `authMiddleware.js` verifies the JWT token and confirms the user is an exhibitor.
7. **Controller Logic**: `boothController.js` performs an atomic database query:
   - If the booth is already booked, it rejects with a `409 Conflict` error.
   - If available, it changes the status to `'Booked'` and links the exhibitor.
8. **Real-Time Broadcast**: The server emits a Socket.IO event: `emitBroadcast('booth_updated', booth)`.
9. **Instant Update**: Every other user viewing the floor plan sees the booth color turn gray (Booked) instantly!
10. **Toast Feedback**: The exhibitor sees a green success message: "Booth reserved and confirmed!".

---

## 💡 4. Questions & Answers for Presentation

### Q: Where are passwords stored?
**A:** In the MongoDB `users` collection. They are encrypted using `bcryptjs` with 10 salt rounds. Even if someone inspected the database, they could never see the real passwords.

### Q: How does the login stay active if I refresh the page?
**A:** When you log in, the server generates a JSON Web Token (JWT). The frontend stores this token in browser `localStorage`. When the page reloads, `AuthContext` reads the token and asks `/api/auth/me` to restore your session.

### Q: What prevents two exhibitors from booking the same booth at the same second?
**A:** The backend uses an atomic Mongoose query: `Booth.findOneAndUpdate({ _id: id, status: 'Available' }, ...)`. Because this is an atomic operation, only the first request can match `status: 'Available'`. The second request will find 0 matching records and is immediately rejected with a 409 status code.

### Q: How do I configure MongoDB?
**A:** In `backend/.env`, configure your `MONGODB_URI` pointing to your local MongoDB service (`mongodb://127.0.0.1:27017/eventsphere`) or MongoDB Atlas cloud cluster. The server connects directly to persistent storage.
