import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { joinRoleRoom, joinUserRoom, connectSocket } from '../services/socket';
import toast from 'react-hot-toast';

/**
 * AuthContext
 * Central Authentication store powered strictly by real Node.js / Express JWT endpoints.
 *
 * Security & Integrity Features:
 * - Real JWT verification and persistent session storage
 * - Server-side bcrypt authentication
 * - No fake fallback users, demo shortcuts, or simulated logins
 * - Explicit backend validation on every session restore
 * - No unauthorized role auto-login
 */

const AuthContext = createContext(null);
const TOKEN_KEY = 'eventsphere_token';
const USER_KEY = 'eventsphere_auth_user';

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  // Sync token & user with socket rooms and localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (user && token) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      connectSocket();
      joinRoleRoom(user.role);
      joinUserRoom(user.id || user._id);
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [token, user]);

  // Revalidate session on initial app load with backend
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        try {
          const res = await authAPI.getMe();
          if (res.data?.user) {
            const u = res.data.user;
            setUser({
              ...u,
              id: u._id || u.id
            });
            connectSocket();
          }
        } catch (err) {
          console.warn('[Auth] Session validation expired or unavailable:', err.message);
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  // Real Server Login with email and password
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      const normalizedUser = {
        ...receivedUser,
        id: receivedUser.id || receivedUser._id
      };

      setToken(receivedToken);
      setUser(normalizedUser);
      toast.success(`Welcome back, ${normalizedUser.name}!`);
      return normalizedUser;
    } catch (err) {
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Real Server Registration
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const res = await authAPI.register(userData);
      const { token: receivedToken, user: receivedUser } = res.data;

      const normalizedUser = {
        ...receivedUser,
        id: receivedUser.id || receivedUser._id
      };

      setToken(receivedToken);
      setUser(normalizedUser);
      toast.success(`Account registered successfully as ${normalizedUser.role.toUpperCase()}!`);
      return normalizedUser;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out user
  const logout = (showToast = true) => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    if (showToast) {
      toast.success('Signed out successfully');
    }
  };

  // Update profile fields
  const updateUserProfile = async (updatedFields) => {
    try {
      const res = await authAPI.updateProfile(updatedFields);
      if (res.data?.user) {
        const u = res.data.user;
        setUser((prev) => ({
          ...prev,
          ...u,
          id: u._id || u.id
        }));
      } else {
        setUser((prev) => ({ ...prev, ...updatedFields }));
      }
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed updating profile');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
