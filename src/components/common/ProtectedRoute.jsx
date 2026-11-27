import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoadingSkeleton } from './LoadingSkeleton';

/**
 * ProtectedRoute
 * Protects dashboard routes ensuring user is authenticated and authorized for their role.
 */
export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, role, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4">
          <LoadingSkeleton height="h-12" count={1} />
          <LoadingSkeleton height="h-64" count={1} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If role is restricted and user's role is not authorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Admins have supervisory access to inspect other portals; non-admins are routed to their role portal
    if (role === 'exhibitor') {
      return <Navigate to="/exhibitor" replace />;
    } else if (role === 'attendee') {
      return <Navigate to="/attendee" replace />;
    } else {
      return <Navigate to="/admin" replace />;
    }
  }

  return children;
};
