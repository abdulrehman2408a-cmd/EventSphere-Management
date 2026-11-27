import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { AppRoutes } from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

/**
 * ScrollToTop helper component
 * Automatically scrolls to top (0,0) whenever the route/page changes.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/**
 * Root App component
 * Wraps the entire application with:
 * 1. BrowserRouter: For client-side URL routing
 * 2. AuthProvider: Manages user login state & roles (Admin, Exhibitor, Attendee)
 * 3. DataProvider: Manages all mock data & localStorage persistence
 * 4. Toaster: Shows pleasant popup notifications for user actions
 * 5. AppRoutes: Defines all public and dashboard pages
 */
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <ScrollToTop />
          <AppRoutes />
          {/* Notification popup provider */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: '#0F172A',
                color: '#FFFFFF',
                borderRadius: '14px',
                fontSize: '13px',
                fontWeight: '500',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25)'
              },
              success: {
                iconTheme: {
                  primary: '#3B82F6',
                  secondary: '#FFFFFF'
                }
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FFFFFF'
                }
              }
            }}
          />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
