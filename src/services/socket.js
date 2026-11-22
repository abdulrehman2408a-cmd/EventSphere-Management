import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem('eventsphere_token');
    cb({ token: token || '' });
  },
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000
});

socket.on('connect', () => {
  console.log('[Socket] Connected to EventSphere real-time service:', socket.id);
});

socket.on('connect_error', (error) => {
  console.debug('[Socket] Real-time service connection notice:', error.message);
});

export const connectSocket = () => {
  if (!socket.connected) {
    // Refresh auth token before connecting
    socket.auth = (cb) => {
      const token = localStorage.getItem('eventsphere_token');
      cb({ token: token || '' });
    };
    socket.connect();
  }
};

export const joinRoleRoom = (role) => {
  if (socket.connected && role) {
    socket.emit('join_role', role);
  }
};

export const joinUserRoom = (userId) => {
  if (socket.connected && userId) {
    socket.emit('join_user', userId);
  }
};

export const joinExpoRoom = (expoId) => {
  if (socket.connected && expoId) {
    socket.emit('join_expo', expoId);
  }
};
