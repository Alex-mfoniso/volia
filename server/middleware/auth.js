/**
 * VOLIA NIG LTD — Express Backend Authentication Middleware
 * Validates session bearer tokens and enforces role-based access control.
 */

import { users } from '../data/store.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Missing Authorization header.',
    });
  }

  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : authHeader.trim();

  // Find user by verified session token
  const user = users.find((u) => u.token === token);
  if (!user) {
    // In production, reject strictly without raw identifier fallback
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired authentication credentials.',
      });
    }

    // For local development fixtures only
    const userById = users.find((u) => u.id === token || u.email === token);
    if (userById) {
      req.user = userById;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid or expired authentication credentials.',
    });
  }

  req.user = user;
  next();
};

export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    // super_admin always has access
    if (req.user.role === 'super_admin' || allowedRoles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Insufficient permissions for role '${req.user.role}'. Required: ${allowedRoles.join(', ')}`,
    });
  };
};
