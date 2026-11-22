import jwt from 'jsonwebtoken';

let io = null;

export const initSocket = (socketIoInstance) => {
  io = socketIoInstance;

  // JWT Authentication middleware for Socket.IO
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (token && process.env.JWT_SECRET) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = { id: decoded.id, role: decoded.role };
      } catch (err) {
        // Token invalid - socket connects as unauthenticated
        socket.user = null;
      }
    } else {
      socket.user = null;
    }
    next(); // Always allow connection; authorization is per-room
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id} (user: ${socket.user?.id || 'guest'})`);

    // Join room based on role - only join your own role
    socket.on('join_role', (role) => {
      if (!role) return;
      
      // Admin rooms require verified admin JWT
      if (role === 'admin') {
        if (socket.user?.role === 'admin') {
          socket.join(`role:${role}`);
          console.log(`[Socket.IO] ${socket.id} joined admin room`);
        } else {
          console.warn(`[Socket.IO] Unauthorized attempt to join admin room from ${socket.id}`);
        }
        return;
      }
      
      // Other role rooms: must match verified JWT role (or be guest joining attendee)
      if (socket.user) {
        if (socket.user.role === role) {
          socket.join(`role:${role}`);
          console.log(`[Socket.IO] ${socket.id} joined room role:${role}`);
        }
      } else if (role === 'attendee') {
        // Unauthenticated users can join public attendee room
        socket.join('role:attendee');
      }
    });

    // Join personal user room - must match verified JWT identity
    socket.on('join_user', (userId) => {
      if (!userId || !socket.user) return;
      
      if (socket.user.id?.toString() === userId?.toString()) {
        socket.join(`user:${userId}`);
        console.log(`[Socket.IO] ${socket.id} joined room user:${userId}`);
      } else {
        console.warn(`[Socket.IO] Unauthorized attempt to join user room ${userId} from ${socket.id} (user: ${socket.user.id})`);
      }
    });

    // Join specific expo room (public - anyone can join)
    socket.on('join_expo', (expoId) => {
      if (expoId) {
        socket.join(`expo:${expoId}`);
        console.log(`[Socket.IO] ${socket.id} joined room expo:${expoId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

// Emits notification to specific user
export const emitToUser = (userId, event, data) => {
  if (io && userId) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

// Emits event to all users of a specific role
export const emitToRole = (role, event, data) => {
  if (io && role) {
    io.to(`role:${role}`).emit(event, data);
  }
};

// Broadcasts event to all connected clients
export const emitBroadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};
