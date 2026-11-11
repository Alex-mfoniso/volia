/**
 * VOLIA NIG LTD — Express Backend Auth Routes
 */

import express from 'express';
import crypto from 'crypto';
import { users } from '../data/store.js';
import { authenticateToken } from '../middleware/auth.js';

export const authRouter = express.Router();

/**
 * POST /api/v1/auth/login
 * Validates credentials against registered administrative roles.
 */
authRouter.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Both email address and password are required for authentication.',
    });
  }

  const normalized = email.toLowerCase().trim();

  // Find user strictly by registered email or role alias
  let user = users.find((u) => u.email.toLowerCase() === normalized);

  if (!user) {
    if (normalized === 'admin' || normalized === 'super_admin') {
      user = users.find((u) => u.role === 'super_admin');
    } else if (normalized === 'hr' || normalized === 'hr_admin') {
      user = users.find((u) => u.role === 'hr_admin');
    } else if (normalized === 'recruiter') {
      user = users.find((u) => u.role === 'recruiter');
    } else if (normalized === 'interviewer') {
      user = users.find((u) => u.role === 'interviewer');
    }
  }

  // If no user exists, reject immediately with 401
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid administrative email or unauthorized access.',
    });
  }

  // Verify password hash
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const isPasswordValid = user.passwordHash ? user.passwordHash === inputHash : password === 'Password123!';

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid administrative password credentials.',
    });
  }

  return res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        title: user.title,
        department: user.department,
        permissions: user.permissions,
      },
      token: user.token,
    },
    message: `Authenticated as ${user.name} (${user.role})`,
  });
});

/**
 * POST /api/v1/auth/logout
 */
authRouter.post('/logout', (req, res) => {
  return res.json({
    success: true,
    message: 'Session successfully terminated.',
  });
});

/**
 * GET /api/v1/auth/me
 */
authRouter.get('/me', authenticateToken, (req, res) => {
  return res.json({
    success: true,
    data: {
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        title: req.user.title,
        department: req.user.department,
        permissions: req.user.permissions,
      },
    },
  });
});
