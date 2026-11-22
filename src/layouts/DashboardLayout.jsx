import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Derive clear, simple page title from pathname
  const getPageTitle = () => {
    const p = location.pathname;
    if (p === '/admin') return 'Organizer Overview';
    if (p.includes('/admin/expos')) return 'Expo Management';
    if (p.includes('/admin/exhibitors')) return 'Exhibitors & Applications';
    if (p.includes('/admin/booths')) return 'Floor Plan & Booths';
    if (p.includes('/admin/schedule')) return 'Event Schedule';
    if (p.includes('/admin/attendees')) return 'Registered Attendees';
    if (p.includes('/admin/analytics')) return 'Analytics & Reports';
    if (p.includes('/admin/communication')) return 'Messages & Inquiries';
    if (p.includes('/admin/feedback')) return 'Feedback & Reviews';
    if (p.includes('/admin/settings')) return 'Organizer Settings';

    if (p === '/exhibitor') return 'Exhibitor Overview';
    if (p.includes('/exhibitor/profile')) return 'Company Profile';
    if (p.includes('/exhibitor/products')) return 'Products & Services';
    if (p.includes('/exhibitor/applications')) return 'Expo Applications';
    if (p.includes('/exhibitor/booths')) return 'My Booths & Floor Plan';
    if (p.includes('/exhibitor/staff')) return 'Booth Staff Passes';
    if (p.includes('/exhibitor/messages')) return 'Messages';
    if (p.includes('/exhibitor/settings')) return 'Account Settings';

    if (p === '/attendee') return 'Attendee Dashboard';
    if (p.includes('/attendee/events')) return 'My Registered Events';
    if (p.includes('/attendee/directory')) return 'Exhibitor Directory';
    if (p.includes('/attendee/schedule')) return 'Conference Schedule';
    if (p.includes('/attendee/bookmarks')) return 'Bookmarked Sessions';
    if (p.includes('/attendee/notifications')) return 'Notifications';
    if (p.includes('/attendee/feedback')) return 'Submit Feedback';
    if (p.includes('/attendee/settings')) return 'Profile Settings';

    return 'EventSphere Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <div className="flex-1 flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Header
            title={getPageTitle()}
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
