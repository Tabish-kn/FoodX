import express, { Request, Response } from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from './config';
import { errorHandler, sendSuccess } from './common/response';

// Route Handlers
import { authRouter } from './auth/auth.routes';
import { usersRouter } from './users/users.routes';
import { donationsRouter } from './donations/donations.routes';
import { deliveriesRouter } from './deliveries/deliveries.routes';
import { requestsRouter } from './requests/requests.routes';
import { rewardsRouter } from './rewards/rewards.routes';
import { paymentsRouter } from './payments/payments.routes';
import { notificationsRouter } from './notifications/notifications.routes';
import { complaintsRouter } from './complaints/complaints.routes';
import { matchingRouter } from './matching/matching.routes';
import { adminRouter } from './admin/admin.routes';

// WebSocket Gateways
import { setupTrackingGateway } from './tracking/tracking.gateway';
import { setupChatGateway } from './chat/chat.gateway';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Setup Real-time gateways
setupTrackingGateway(io);
setupChatGateway(io);

// Global Middleware
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check & Documentation Root
app.get('/', (req: Request, res: Response) => {
  return sendSuccess(res, {
    name: 'FoodX Core API Server',
    version: '1.0.0',
    status: 'ONLINE',
    demoMode: config.demoMode,
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      donations: '/api/v1/donations',
      deliveries: '/api/v1/deliveries',
      requests: '/api/v1/requests',
      rewards: '/api/v1/rewards',
      payments: '/api/v1/payments',
      notifications: '/api/v1/notifications',
      complaints: '/api/v1/complaints',
      admin: '/api/v1/admin'
    }
  }, 'FoodX API Gateway is running smoothly');
});

// API v1 Routing
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/donations', donationsRouter);
app.use('/api/v1/deliveries', deliveriesRouter);
app.use('/api/v1/requests', requestsRouter);
app.use('/api/v1/rewards', rewardsRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/complaints', complaintsRouter);
app.use('/api/v1/matching', matchingRouter);
app.use('/api/v1/admin', adminRouter);

// Global Error Interceptor
app.use(errorHandler);

// Start HTTP & WS Server
server.listen(config.port, () => {
  console.log(`
  🍲 ============================================================== 🍲
     FOODX — REAL-TIME FOOD RESCUE & DONATION ENGINE (API SERVER)
     Status    : ONLINE
     Port      : ${config.port}
     Env       : ${config.nodeEnv}
     Demo Mode : ${config.demoMode ? 'ENABLED (Mock Adapters Active)' : 'DISABLED'}
     WS URL    : ws://localhost:${config.port}
     API Root  : http://localhost:${config.port}/api/v1
  🍲 ============================================================== 🍲
  `);
});

export { app, server, io };
