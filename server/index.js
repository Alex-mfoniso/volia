/**
 * VOLIA NIG LTD — Express Application Server
 * High-performance backend powering the corporate engineering platform
 * and recruitment talent management OS.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import { authRouter } from './routes/auth.js';
import { jobsRouter } from './routes/jobs.js';
import { applicationsRouter } from './routes/applications.js';
import { candidatesRouter } from './routes/candidates.js';
import { interviewsRouter } from './routes/interviews.js';
import { dashboardRouter } from './routes/dashboard.js';
import { enquiriesRouter } from './routes/enquiries.js';
import { notificationsRouter } from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Security Headers with Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed by client build and reverse proxy for R3F shaders & fonts
    crossOriginEmbedderPolicy: false,
  })
);

// CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((o) => o.trim())
  : true;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  })
);

// Rate Limiting
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
  },
});

const applyRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 30, // 30 applications per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many application submissions detected. Please try again later.',
  },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'operational',
    service: 'VOLIA NIG LTD Backend API',
    engine: 'Express on Node.js',
    environment: process.env.NODE_ENV || 'production',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount Routes with Rate Limiting
app.use('/api/v1/auth/login', authRateLimiter);
app.use('/api/v1/careers/apply', applyRateLimiter);

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/jobs', jobsRouter);
app.use('/api/v1/careers', applicationsRouter);
app.use('/api/v1/admin/applications', applicationsRouter);
app.use('/api/v1/admin/candidates', candidatesRouter);
app.use('/api/v1/admin/interviews', interviewsRouter);
app.use('/api/v1/admin/dashboard', dashboardRouter);
app.use('/api/v1/admin/notifications', notificationsRouter);
app.use('/api/v1/enquiries', enquiriesRouter);

// 404 Handler for API Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.originalUrl}' not found.`,
  });
});

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Start Server
const server = app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(` VOLIA NIG LTD — Express Backend API Engine`);
  console.log(` Server active on http://localhost:${PORT}`);
  console.log(` Health check:   http://localhost:${PORT}/api/v1/health`);
  console.log(`====================================================`);
});

export default app;
