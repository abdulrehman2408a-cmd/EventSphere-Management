import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  expoAPI,
  exhibitorAPI,
  boothAPI,
  scheduleAPI,
  registrationAPI,
  notificationAPI,
  messageAPI,
  feedbackAPI,
  bookmarkAPI
} from '../services/api';
import { socket } from '../services/socket';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const DataContext = createContext(null);

// Helper to normalize Mongo documents ensuring both .id and ._id are accessible
const normalizeDoc = (doc) => {
  if (!doc) return doc;
  const id = doc._id ? doc._id.toString() : doc.id;
  return {
    ...doc,
    id: id || doc.id,
    _id: doc._id || doc.id
  };
};

const normalizeArray = (arr, fallback = []) => {
  if (!Array.isArray(arr)) return fallback;
  return arr.map(normalizeDoc);
};

export const DataProvider = ({ children }) => {
  const { user, token } = useAuth();

  // Real database state entities initialized empty (no mock/demo data)
  const [expos, setExpos] = useState([]);
  const [exhibitors, setExhibitors] = useState([]);
  const [booths, setBooths] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [staff, setStaff] = useState([]);

  // Attendee bookmarks & registrations
  const [bookmarks, setBookmarks] = useState([]);
  const [registeredExpoIds, setRegisteredExpoIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // ============================================================
  // Fetch Live Data from Backend API (MongoDB)
  // ============================================================
  const fetchAllData = useCallback(async () => {
    try {
      const [
        exposRes,
        exhibitorsRes,
        boothsRes,
        sessionsRes,
        feedbackRes
      ] = await Promise.allSettled([
        expoAPI.getAll(),
        exhibitorAPI.getAll(),
        boothAPI.getAll(),
        scheduleAPI.getAll(),
        feedbackAPI.getAll()
      ]);

      if (exposRes.status === 'fulfilled' && exposRes.value.data?.data) {
        setExpos(normalizeArray(exposRes.value.data.data, []));
      } else {
        setExpos([]);
      }

      if (exhibitorsRes.status === 'fulfilled' && exhibitorsRes.value.data?.data) {
        const normExhibitors = normalizeArray(exhibitorsRes.value.data.data, []);
        setExhibitors(normExhibitors);
        const allStaff = normExhibitors.flatMap((e) => (e.staff || []).map(normalizeDoc));
        setStaff(allStaff);
      } else {
        setExhibitors([]);
        setStaff([]);
      }

      if (boothsRes.status === 'fulfilled' && boothsRes.value.data?.data) {
        setBooths(normalizeArray(boothsRes.value.data.data, []));
      } else {
        setBooths([]);
      }

      if (sessionsRes.status === 'fulfilled' && sessionsRes.value.data?.data) {
        setSessions(normalizeArray(sessionsRes.value.data.data, []));
      } else {
        setSessions([]);
      }

      if (feedbackRes.status === 'fulfilled' && feedbackRes.value.data?.data) {
        setFeedback(normalizeArray(feedbackRes.value.data.data, []));
      } else {
        setFeedback([]);
      }

      // If user is authenticated, fetch protected user data from MongoDB
      if (token) {
        const regPromise = user?.role === 'admin'
          ? registrationAPI.getAll()
          : registrationAPI.getMy();

        const [regRes, notifRes, msgRes, bmRes] = await Promise.allSettled([
          regPromise,
          notificationAPI.getAll(),
          messageAPI.getAll(),
          bookmarkAPI.getMy()
        ]);

        if (regRes.status === 'fulfilled' && regRes.value.data?.data) {
          const normAttendees = normalizeArray(regRes.value.data.data, []);
          setAttendees(normAttendees);
          const userExpoIds = normAttendees.map((a) => a.expo?._id || a.expo?.id || a.expoId);
          setRegisteredExpoIds(userExpoIds.filter(Boolean));
        } else {
          setAttendees([]);
          setRegisteredExpoIds([]);
        }

        if (notifRes.status === 'fulfilled' && notifRes.value.data?.data) {
          setNotifications(normalizeArray(notifRes.value.data.data, []));
        } else {
          setNotifications([]);
        }

        if (msgRes.status === 'fulfilled' && msgRes.value.data?.data) {
          setMessages(normalizeArray(msgRes.value.data.data, []));
        } else {
          setMessages([]);
        }

        if (bmRes.status === 'fulfilled' && bmRes.value.data?.sessionIds) {
          setBookmarks(bmRes.value.data.sessionIds);
        } else {
          setBookmarks([]);
        }
      } else {
        setAttendees([]);
        setNotifications([]);
        setMessages([]);
        setBookmarks([]);
        setRegisteredExpoIds([]);
      }
    } catch (err) {
      console.warn('[DataContext] Backend sync notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, user?.role]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ============================================================
  // Socket.IO Real-Time Listeners
  // ============================================================
  useEffect(() => {
    // Listen for live booth status updates across attendees/exhibitors
    const handleBoothUpdated = (updatedBooth) => {
      setBooths((prev) =>
        prev.map((b) =>
          b.id === updatedBooth.id || b._id === updatedBooth.id
            ? { ...b, ...updatedBooth }
            : b
        )
      );
    };

    // Listen for live session schedule updates
    const handleScheduleUpdated = ({ action, session, sessionId }) => {
      if (action === 'created' && session) {
        setSessions((prev) => [normalizeDoc(session), ...prev]);
      } else if (action === 'updated' && session) {
        setSessions((prev) =>
          prev.map((s) => (s.id === session._id || s.id === session.id ? normalizeDoc(session) : s))
        );
      } else if (action === 'deleted' && sessionId) {
        setSessions((prev) => prev.filter((s) => s.id !== sessionId && s._id !== sessionId));
      }
    };

    // Listen for live notifications
    const handleNewNotification = (notif) => {
      setNotifications((prev) => [normalizeDoc(notif), ...prev]);
      toast(notif.title || 'New Notification', { icon: '🔔' });
    };

    // Listen for live incoming messages
    const handleNewMessage = (msg) => {
      setMessages((prev) => [normalizeDoc(msg), ...prev]);
    };

    socket.on('booth_updated', handleBoothUpdated);
    socket.on('schedule_updated', handleScheduleUpdated);
    socket.on('new_notification', handleNewNotification);
    socket.on('new_message', handleNewMessage);

    return () => {
      socket.off('booth_updated', handleBoothUpdated);
      socket.off('schedule_updated', handleScheduleUpdated);
      socket.off('new_notification', handleNewNotification);
      socket.off('new_message', handleNewMessage);
    };
  }, []);

  // ============================================================
  // EXPO ACTIONS
  // ============================================================
  const createExpo = async (newExpoData) => {
    try {
      const res = await expoAPI.create(newExpoData);
      const created = normalizeDoc(res.data.data);
      setExpos((prev) => [created, ...prev]);
      toast.success('New Expo published successfully!');
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to create expo');
      throw err;
    }
  };

  const updateExpo = async (id, updatedFields) => {
    try {
      const res = await expoAPI.update(id, updatedFields);
      const updated = normalizeDoc(res.data.data);
      setExpos((prev) => prev.map((e) => (e.id === id || e._id === id ? updated : e)));
      toast.success('Expo updated successfully!');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update expo');
      throw err;
    }
  };

  const deleteExpo = async (id) => {
    try {
      await expoAPI.delete(id);
      setExpos((prev) => prev.filter((e) => e.id !== id && e._id !== id));
      toast.success('Expo removed');
    } catch (err) {
      toast.error(err.message || 'Failed to delete expo');
    }
  };

  // ============================================================
  // EXHIBITOR ACTIONS
  // ============================================================
  const approveExhibitor = async (id) => {
    try {
      await exhibitorAPI.approve(id);
      setExhibitors((prev) =>
        prev.map((e) => (e.id === id || e._id === id ? { ...e, status: 'Approved' } : e))
      );
      toast.success('Exhibitor application approved!');
    } catch (err) {
      toast.error(err.message || 'Failed to approve exhibitor');
    }
  };

  const rejectExhibitor = async (id) => {
    try {
      await exhibitorAPI.reject(id);
      setExhibitors((prev) =>
        prev.map((e) => (e.id === id || e._id === id ? { ...e, status: 'Rejected' } : e))
      );
      toast.error('Exhibitor application rejected');
    } catch (err) {
      toast.error(err.message || 'Failed to reject exhibitor');
    }
  };

  const updateExhibitorProfile = async (id, updatedData) => {
    try {
      const res = await exhibitorAPI.updateProfile(id, updatedData);
      const updated = normalizeDoc(res.data.data);
      setExhibitors((prev) => prev.map((e) => (e.id === id || e._id === id ? updated : e)));
      toast.success('Company profile updated successfully!');
      return updated;
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const addExhibitorProduct = async (exhibitorId, product) => {
    try {
      const res = await exhibitorAPI.addProduct(exhibitorId, product);
      setExhibitors((prev) =>
        prev.map((e) => {
          if (e.id === exhibitorId || e._id === exhibitorId) {
            return { ...e, products: res.data.data || [...(e.products || []), product] };
          }
          return e;
        })
      );
      toast.success('Product/Service added to showcase!');
    } catch (err) {
      toast.error(err.message || 'Failed to add product');
    }
  };

  const removeExhibitorProduct = async (exhibitorId, index, productId) => {
    try {
      if (productId) {
        await exhibitorAPI.removeProduct(exhibitorId, productId);
      }
      setExhibitors((prev) =>
        prev.map((e) => {
          if (e.id === exhibitorId || e._id === exhibitorId) {
            const next = [...(e.products || [])];
            next.splice(index, 1);
            return { ...e, products: next };
          }
          return e;
        })
      );
      toast.success('Product removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove product');
    }
  };

  // ============================================================
  // BOOTH ACTIONS
  // ============================================================
  const bookBooth = async (boothId, exhibitorId, exhibitorName) => {
    try {
      const res = await boothAPI.book(boothId, { exhibitorId, exhibitorName });
      const updatedBooth = normalizeDoc(res.data.data);

      setBooths((prev) =>
        prev.map((b) => (b.id === boothId || b._id === boothId ? updatedBooth : b))
      );

      // Link booth to exhibitor profile
      setExhibitors((prev) =>
        prev.map((e) => {
          if (e.id === exhibitorId || e._id === exhibitorId) {
            return { ...e, boothNumber: updatedBooth.number };
          }
          return e;
        })
      );

      toast.success(`Booth ${updatedBooth.number} reserved and confirmed!`);
      return updatedBooth;
    } catch (err) {
      toast.error(err.message || 'Booth booking failed');
      throw err;
    }
  };

  const updateBoothStatus = async (boothId, newStatus, exhibitorId = null, exhibitorName = null) => {
    try {
      const res = await boothAPI.updateStatus(boothId, {
        status: newStatus,
        exhibitorId,
        exhibitorName
      });
      const updated = normalizeDoc(res.data.data);
      setBooths((prev) =>
        prev.map((b) => (b.id === boothId || b._id === boothId ? updated : b))
      );
      toast.success(`Booth status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err.message || 'Failed to update booth');
    }
  };

  // ============================================================
  // SESSION ACTIONS
  // ============================================================
  const createSession = async (sessionData) => {
    try {
      const res = await scheduleAPI.create(sessionData);
      const created = normalizeDoc(res.data.data);
      setSessions((prev) => [created, ...prev]);
      toast.success('Session scheduled successfully!');
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to schedule session');
      throw err;
    }
  };

  const updateSession = async (id, updatedFields) => {
    try {
      const res = await scheduleAPI.update(id, updatedFields);
      const updated = normalizeDoc(res.data.data);
      setSessions((prev) => prev.map((s) => (s.id === id || s._id === id ? updated : s)));
      toast.success('Session updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update session');
    }
  };

  const deleteSession = async (id) => {
    try {
      await scheduleAPI.delete(id);
      setSessions((prev) => prev.filter((s) => s.id !== id && s._id !== id));
      toast.success('Session removed from schedule');
    } catch (err) {
      toast.error(err.message || 'Failed to delete session');
    }
  };

  const toggleBookmarkSession = async (sessionId) => {
    try {
      const res = await bookmarkAPI.toggle(sessionId);
      if (res.data?.sessionIds) {
        setBookmarks(res.data.sessionIds);
      } else {
        setBookmarks((prev) =>
          prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
        );
      }
      toast.success(res.data?.message || 'Bookmarks updated');
    } catch {
      // Local toggle fallback
      setBookmarks((prev) => {
        const exists = prev.includes(sessionId);
        if (exists) {
          toast('Session removed from bookmarks', { icon: '🔖' });
          return prev.filter((id) => id !== sessionId);
        } else {
          toast.success('Session added to your personal schedule!');
          return [...prev, sessionId];
        }
      });
    }
  };

  // ============================================================
  // ATTENDEE & REGISTRATION ACTIONS
  // ============================================================
  const registerForExpo = async (expoId, attendeeDetails) => {
    try {
      const res = await registrationAPI.register({
        expoId,
        ...attendeeDetails
      });
      const newAttendee = normalizeDoc(res.data.data);

      setAttendees((prev) => [newAttendee, ...prev]);
      setRegisteredExpoIds((prev) => Array.from(new Set([...prev, expoId])));

      // Increment count on expo
      setExpos((prev) =>
        prev.map((e) =>
          e.id === expoId || e._id === expoId
            ? { ...e, registeredAttendees: (e.registeredAttendees || 0) + 1 }
            : e
        )
      );

      toast.success(`Registered for ${newAttendee.expoTitle}! Digital pass generated.`);
      return newAttendee;
    } catch (err) {
      toast.error(err.message || 'Registration failed');
      throw err;
    }
  };

  const toggleAttendeeCheckIn = async (attendeeId) => {
    try {
      const res = await registrationAPI.toggleCheckIn(attendeeId);
      const updated = normalizeDoc(res.data.data);
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendeeId || a._id === attendeeId ? updated : a))
      );
      toast(updated.checkedIn ? `Check-in confirmed for ${updated.attendeeName}` : `Check-in reversed for ${updated.attendeeName}`, {
        icon: updated.checkedIn ? '✅' : 'ℹ️'
      });
    } catch (err) {
      toast.error(err.message || 'Failed to update check-in');
    }
  };

  // ============================================================
  // NOTIFICATIONS, MESSAGES & FEEDBACK
  // ============================================================
  const markNotificationAsRead = async (id) => {
    try {
      await notificationAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, unread: false } : n))
      );
    } catch {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id || n._id === id ? { ...n, unread: false } : n))
      );
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
      toast.success('All notifications marked as read');
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    }
  };

  const sendMessageReply = async (messageId, replyText, senderName) => {
    try {
      const res = await messageAPI.reply(messageId, {
        text: replyText,
        senderName: senderName || user?.name
      });
      const updated = normalizeDoc(res.data.data);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId || m._id === messageId ? updated : m))
      );
      toast.success('Reply dispatched to sender!');
    } catch (err) {
      toast.error(err.message || 'Failed to dispatch reply');
    }
  };

  const submitContactMessage = async (newMessage) => {
    try {
      const res = await messageAPI.send({
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        message: newMessage.message
      });
      const created = normalizeDoc(res.data.data);
      setMessages((prev) => [created, ...prev]);
      toast.success('Your message has been received!');
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to send message');
      throw err;
    }
  };

  const submitFeedback = async (fbData) => {
    try {
      const res = await feedbackAPI.submit(fbData);
      const created = normalizeDoc(res.data.data);
      setFeedback((prev) => [created, ...prev]);
      toast.success('Thank you for your feedback!');
      return created;
    } catch (err) {
      toast.error(err.message || 'Failed to submit feedback');
      throw err;
    }
  };

  const addStaffMember = async (staffData) => {
    try {
      // Find exhibitor ID for current user
      const exhibitor = exhibitors.find(
        (e) => e.user === user?.id || e.user?._id === user?.id || e.email === user?.email
      );
      if (exhibitor) {
        const res = await exhibitorAPI.addStaff(exhibitor.id || exhibitor._id, staffData);
        setStaff(res.data.data || [...staff, { ...staffData, badgeIssued: true }]);
      } else {
        setStaff((prev) => [...prev, { id: `st_${Date.now()}`, ...staffData, badgeIssued: true }]);
      }
      toast.success('Booth staff member added');
    } catch (err) {
      toast.error(err.message || 'Failed to add staff');
    }
  };

  const removeStaffMember = async (staffId) => {
    try {
      const exhibitor = exhibitors.find(
        (e) => e.user === user?.id || e.user?._id === user?.id || e.email === user?.email
      );
      if (exhibitor) {
        await exhibitorAPI.removeStaff(exhibitor.id || exhibitor._id, staffId);
      }
      setStaff((prev) => prev.filter((s) => s.id !== staffId && s._id !== staffId));
      toast.success('Staff member removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove staff');
    }
  };

  const resetToDemoData = async () => {
    setIsLoading(true);
    await fetchAllData();
    toast.success('Data synchronized with latest database records');
    setIsLoading(false);
  };

  return (
    <DataContext.Provider
      value={{
        expos,
        exhibitors,
        booths,
        sessions,
        attendees,
        notifications,
        messages,
        feedback,
        staff,
        bookmarks,
        registeredExpoIds,
        isLoading,
        // Expo
        createExpo,
        updateExpo,
        deleteExpo,
        // Exhibitor
        approveExhibitor,
        rejectExhibitor,
        updateExhibitorProfile,
        addExhibitorProduct,
        removeExhibitorProduct,
        // Booths
        bookBooth,
        updateBoothStatus,
        // Sessions
        createSession,
        updateSession,
        deleteSession,
        toggleBookmarkSession,
        // Attendees
        registerForExpo,
        toggleAttendeeCheckIn,
        // Notifications & Messages
        markNotificationAsRead,
        markAllNotificationsAsRead,
        sendMessageReply,
        submitContactMessage,
        // Feedback & Staff
        submitFeedback,
        addStaffMember,
        removeStaffMember,
        // Reset / Re-sync
        resetToDemoData,
        refreshData: fetchAllData
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
