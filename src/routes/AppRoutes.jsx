import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { ProtectedRoute } from '../components/common/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ExploreExposPage } from '../pages/public/ExploreExposPage';
import { ExpoDetailsPage } from '../pages/public/ExpoDetailsPage';
import { ExhibitorDirectoryPage } from '../pages/public/ExhibitorDirectoryPage';
import { ExhibitorProfilePage } from '../pages/public/ExhibitorProfilePage';
import { SchedulePage } from '../pages/public/SchedulePage';
import { FloorPlanPage } from '../pages/public/FloorPlanPage';
import { ContactPage } from '../pages/public/ContactPage';
import { FAQPage } from '../pages/public/FAQPage';

// Authentication Pages
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';

// Admin / Organizer Dashboard Pages
import { AdminOverview } from '../pages/admin/AdminOverview';
import { AdminExpos } from '../pages/admin/AdminExpos';
import { AdminExhibitors } from '../pages/admin/AdminExhibitors';
import { AdminBooths } from '../pages/admin/AdminBooths';
import { AdminSchedule } from '../pages/admin/AdminSchedule';
import { AdminAttendees } from '../pages/admin/AdminAttendees';
import { AdminAnalytics } from '../pages/admin/AdminAnalytics';
import { AdminCommunication } from '../pages/admin/AdminCommunication';
import { AdminFeedback } from '../pages/admin/AdminFeedback';
import { AdminSettings } from '../pages/admin/AdminSettings';

// Exhibitor Dashboard Pages
import { ExhibitorOverview } from '../pages/exhibitor/ExhibitorOverview';
import { ExhibitorProfile } from '../pages/exhibitor/ExhibitorProfile';
import { ExhibitorProducts } from '../pages/exhibitor/ExhibitorProducts';
import { ExhibitorApplications } from '../pages/exhibitor/ExhibitorApplications';
import { ExhibitorBooths } from '../pages/exhibitor/ExhibitorBooths';
import { ExhibitorStaff } from '../pages/exhibitor/ExhibitorStaff';
import { ExhibitorMessages } from '../pages/exhibitor/ExhibitorMessages';
import { ExhibitorSettings } from '../pages/exhibitor/ExhibitorSettings';

// Attendee Dashboard Pages
import { AttendeeOverview } from '../pages/attendee/AttendeeOverview';
import { AttendeeRegisteredEvents } from '../pages/attendee/AttendeeRegisteredEvents';
import { AttendeeDirectory } from '../pages/attendee/AttendeeDirectory';
import { AttendeeSchedule } from '../pages/attendee/AttendeeSchedule';
import { AttendeeBookmarks } from '../pages/attendee/AttendeeBookmarks';
import { AttendeeNotifications } from '../pages/attendee/AttendeeNotifications';
import { AttendeeFeedback } from '../pages/attendee/AttendeeFeedback';
import { AttendeeSettings } from '../pages/attendee/AttendeeSettings';

// 404 Page
import { NotFoundPage } from '../pages/NotFoundPage';

/**
 * AppRoutes component
 * Configures all application routes and groups them by layout:
 * 1. PublicLayout: Public marketing website (Home, About, Expos, Schedule, etc.)
 * 2. DashboardLayout: Shared sidebar & header for Admin, Exhibitor, and Attendee dashboards
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Public Website Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/expos" element={<ExploreExposPage />} />
        <Route path="/expos/:id" element={<ExpoDetailsPage />} />
        <Route path="/exhibitors" element={<ExhibitorDirectoryPage />} />
        <Route path="/exhibitors/:id" element={<ExhibitorProfilePage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/floor-plan" element={<FloorPlanPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* 2. Admin / Organizer Dashboard Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminOverview />} />
        <Route path="expos" element={<AdminExpos />} />
        <Route path="exhibitors" element={<AdminExhibitors />} />
        <Route path="booths" element={<AdminBooths />} />
        <Route path="schedule" element={<AdminSchedule />} />
        <Route path="attendees" element={<AdminAttendees />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="communication" element={<AdminCommunication />} />
        <Route path="feedback" element={<AdminFeedback />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* 3. Exhibitor Dashboard Routes */}
      <Route
        path="/exhibitor"
        element={
          <ProtectedRoute allowedRoles={['admin', 'exhibitor']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ExhibitorOverview />} />
        <Route path="profile" element={<ExhibitorProfile />} />
        <Route path="products" element={<ExhibitorProducts />} />
        <Route path="applications" element={<ExhibitorApplications />} />
        <Route path="booths" element={<ExhibitorBooths />} />
        <Route path="staff" element={<ExhibitorStaff />} />
        <Route path="messages" element={<ExhibitorMessages />} />
        <Route path="settings" element={<ExhibitorSettings />} />
      </Route>

      {/* 4. Attendee Dashboard Routes */}
      <Route
        path="/attendee"
        element={
          <ProtectedRoute allowedRoles={['admin', 'attendee']}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AttendeeOverview />} />
        <Route path="events" element={<AttendeeRegisteredEvents />} />
        <Route path="directory" element={<AttendeeDirectory />} />
        <Route path="schedule" element={<AttendeeSchedule />} />
        <Route path="bookmarks" element={<AttendeeBookmarks />} />
        <Route path="notifications" element={<AttendeeNotifications />} />
        <Route path="feedback" element={<AttendeeFeedback />} />
        <Route path="settings" element={<AttendeeSettings />} />
      </Route>

      {/* 5. 404 Fallback Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
