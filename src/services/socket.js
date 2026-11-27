
import { io } from 'socket.io-client';

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ['websocket'],
  auth: (cb) => {
    const token = localStorage.getItem('eventsphere_token');
    cb({ token: token || '' });
  },
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  timeout: 10000
});

socket.on('connect', () => {
  console.log('[Socket] Connected:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('[Socket] Connection failed:', error.message);
});

export const connectSocket = () => {
  if (!socket.connected && !socket.active) {
    socket.auth = {
      token: localStorage.getItem('eventsphere_token') || ''
    };
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket.connected || socket.active) {
    socket.disconnect();
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
