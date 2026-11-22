# EventSphere Management — API Documentation

Comprehensive REST API and WebSocket reference for the EventSphere MERN stack platform.

- **Base URL**: `http://localhost:5000/api`
- **WebSocket URL**: `http://localhost:5000`
- **Authentication**: Bearer Token in `Authorization` header (`Bearer <JWT_TOKEN>`)

---

## 1. Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (Admin, Exhibitor, or Attendee) |
| `POST` | `/api/auth/login` | Public | Authenticate user with email and password |
| `GET` | `/api/auth/me` | Private | Retrieve currently authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update user profile attributes |
| `POST` | `/api/auth/forgot-password` | Public | Request password recovery email |
| `POST` | `/api/auth/reset-password` | Public | Reset password using valid cryptographic token |

### Sample Login Request:
```json
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@eventsphere.pk",
  "password": "password123"
}
```

### Sample Login Response:
```json
{
  "success": true,
  "message": "Welcome back, Daniyal Khan!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "67368f51a23e...",
    "name": "Daniyal Khan",
    "email": "admin@eventsphere.pk",
    "role": "admin",
    "title": "Event Director & Lead Organizer",
    "organization": "EventSphere Global Ltd",
    "phone": "+92 300 1234567",
    "city": "Karachi",
    "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb..."
  }
}
```

---

## 2. Expos & Events (`/api/expos`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/expos` | Public | List expos with filters (`category`, `city`, `status`, `search`) |
| `GET` | `/api/expos/:id` | Public | Single expo details by MongoDB ID or slug |
| `POST` | `/api/expos` | Admin | Create and publish a new expo |
| `PUT` | `/api/expos/:id` | Admin | Update expo details |
| `DELETE` | `/api/expos/:id` | Admin | Remove expo and cascade delete linked items |

---

## 3. Exhibitors & Companies (`/api/exhibitors`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/exhibitors` | Public | List exhibitors with filters (`category`, `city`, `search`, `featured`) |
| `GET` | `/api/exhibitors/:id` | Public | Single exhibitor profile details |
| `PUT` | `/api/exhibitors/:id` | Exhibitor/Admin | Update company profile details |
| `POST` | `/api/exhibitors/:id/upload` | Exhibitor/Admin | Upload logo or corporate documentation via Multer |
| `POST` | `/api/exhibitors/:id/products` | Exhibitor/Admin | Add product/service to showcase |
| `DELETE` | `/api/exhibitors/:id/products/:productId` | Exhibitor/Admin | Remove product/service |
| `POST` | `/api/exhibitors/:id/staff` | Exhibitor/Admin | Issue booth staff access badge |
| `DELETE` | `/api/exhibitors/:id/staff/:staffId` | Exhibitor/Admin | Revoke staff badge |
| `PATCH` | `/api/exhibitors/:id/approve` | Admin | Approve pending exhibitor registration |
| `PATCH` | `/api/exhibitors/:id/reject` | Admin | Reject exhibitor registration |

---

## 4. Booths & Interactive Floor Plan (`/api/booths`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/booths` | Public | List booths (`expoId`, `status`, `category`, `hall`) |
| `GET` | `/api/booths/:id` | Public | Single booth details with dimensions & pricing |
| `POST` | `/api/booths/:id/book` | Exhibitor/Admin | Reserve and book booth with atomic double-booking guard |
| `PUT` | `/api/booths/:id/status` | Admin | Manually update booth status or stall assignment |

### Double-Booking Protection:
The server uses an atomic check-and-set query:
```javascript
Booth.findOneAndUpdate({ _id: id, status: 'Available' }, { status: 'Booked', exhibitor, exhibitorName })
```
If a booth was already claimed, the server halts execution and returns HTTP `409 Conflict`:
```json
{
  "success": false,
  "message": "Booth A-101 is already booked or reserved by another exhibitor."
}
```

---

## 5. Attendee Registrations & Passes (`/api/registrations`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/registrations` | Public/User | Register for an Expo (generates digital ticket pass & QR payload) |
| `GET` | `/api/registrations/my` | Private | Retrieve logged-in attendee's active passes |
| `GET` | `/api/registrations/:id` | Public/User | Fetch specific pass by ID |
| `GET` | `/api/registrations` | Admin | Retrieve all attendee registrations with search/filter |
| `PATCH` | `/api/registrations/:id/checkin` | Admin | Toggle attendee arrival check-in status (turnstile scanner) |

---

## 6. Exhibitor Space Applications (`/api/applications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/applications` | Exhibitor | Submit exhibition stall application |
| `GET` | `/api/applications/my` | Exhibitor | View applications submitted by current account |
| `GET` | `/api/applications` | Admin | Review all pending/approved/rejected applications |
| `PATCH` | `/api/applications/:id/status` | Admin | Update status (`Approved`, `Rejected`) with admin notes |

---

## 7. Conference Schedule & Agenda (`/api/schedule`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/schedule` | Public | List conference agenda sessions (`expoId`, `date`, `category`) |
| `GET` | `/api/schedule/:id` | Public | Single session details |
| `POST` | `/api/schedule/:id/enroll` | Private | Enroll attendee into session |
| `POST` | `/api/schedule` | Admin | Add session to schedule |
| `PUT` | `/api/schedule/:id` | Admin | Edit session details |
| `DELETE` | `/api/schedule/:id` | Admin | Remove session from agenda |

---

## 8. Bookmarks (`/api/bookmarks`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/bookmarks` | Private | List bookmarked sessions for user |
| `POST` | `/api/bookmarks/:sessionId` | Private | Toggle bookmark state on a session |

---

## 9. Messages & Inquiries (`/api/messages`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/messages` | Private | List message threads (role-scoped) |
| `GET` | `/api/messages/:id` | Private | View specific thread with full reply history |
| `POST` | `/api/messages` | Public/User | Send inquiry to organizer support or exhibitor |
| `POST` | `/api/messages/:id/reply` | Private | Post a reply to an ongoing message thread |

---

## 10. Notifications (`/api/notifications`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/notifications` | Private | List role-based notifications |
| `PATCH` | `/api/notifications/:id/read` | Private | Mark single notification as read |
| `PATCH` | `/api/notifications/read-all` | Private | Mark all notifications as read |

---

## 11. Feedback & Reviews (`/api/feedback`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/feedback` | Public | List visitor reviews and ratings |
| `POST` | `/api/feedback` | Public/User | Submit new event review and star rating |

---

## 12. Analytics & Overview (`/api/analytics`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/analytics/overview` | Admin | Top-line KPI metrics, revenue, registrations, and recent items |
| `GET` | `/api/analytics/charts` | Admin | Category breakdown and hall occupancy distributions |

---

## 13. User Management (`/api/users`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | List all registered platform accounts |
| `GET` | `/api/users/:id` | Admin | Fetch user account details |
| `PATCH` | `/api/users/:id/role` | Admin | Promote or alter user role |
| `DELETE` | `/api/users/:id` | Admin | Remove user account |

---

## 14. Real-Time Socket.IO Events

### Client -> Server:
- `join_role`: Join role room (`role:admin`, `role:exhibitor`, `role:attendee`)
- `join_user`: Join private user room (`user:<userId>`)
- `join_expo`: Join expo specific updates room (`expo:<expoId>`)

### Server -> Client (Broadcasts):
- `booth_updated`: Emitted whenever a booth is booked, reserved, or released.
- `schedule_updated`: Emitted when sessions are created, updated, or deleted.
- `new_notification`: Dispatched to target user or role.
- `new_message`: Dispatched to admins or recipient when message arrives.
- `expo_created`: Dispatched when an organizer publishes a new expo.
