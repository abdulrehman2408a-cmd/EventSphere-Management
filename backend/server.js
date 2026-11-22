import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { Server } from 'socket.io';

// Configuration & Database
dotenv.config();
import { connectDB } from './config/db.js';

// Services
import { initSocket } from './services/socketService.js';

// Middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { apiLimiter } from './middleware/rateLimiter.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import expoRoutes from './routes/expoRoutes.js';
import exhibitorRoutes from './routes/exhibitorRoutes.js';
import boothRoutes from './routes/boothRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import userRoutes from './routes/userRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:3000';
const io = new Server(server, {
  cors: {
    origin: clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});
initSocket(io);

// Security & Utility Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: false // Allow uploaded images/assets to be loaded by frontend
  })
);

app.use(
  cors({
    origin: clientOrigin,
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Apply general API rate limiter
app.use('/api', apiLimiter);

// Serve static uploaded files (logos, documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'EventSphere Management API',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/expos', expoRoutes);
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/booths', boothRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/schedule', scheduleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/users', userRoutes);

// 404 & Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`🚀 EventSphere Server active on port ${PORT}`);
      console.log(`📡 Real-time Socket.IO connected & listening`);
      console.log(`🌐 API Base: http://localhost:${PORT}/api`);
      console.log(`=================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, server };
