# VOLIA NIG LTD — Environment Variables Reference

This document provides a comprehensive reference of all environment variables used across the client application and backend server.

---

## 1. Client Environment Variables (`.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `VITE_SITE_URL` | String | `https://volia.ng` | Canonical base URL used for SEO, Open Graph, and Twitter metadata |
| `VITE_APP_ENV` | String | `production` | Environment mode (`development`, `staging`, `production`) |
| `VITE_USE_MOCK_API` | Boolean | `false` | When `false`, uses live Express REST API; when `true`, uses mock fixtures |
| `VITE_API_BASE_URL` | String | `/api/v1` | Endpoint prefix for backend REST services |
| `VITE_MAX_UPLOAD_SIZE_MB` | Number | `5` | Maximum permitted file upload size in megabytes |
| `VITE_GA_MEASUREMENT_ID` | String | *Optional* | Google Analytics 4 measurement tag ID |

---

## 2. Server Environment Variables (`server/.env`)

| Variable | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Number | `5000` | HTTP port on which the Express server listens |
| `NODE_ENV` | String | `production` | Node runtime environment |
| `CORS_ORIGIN` | String | `https://volia.ng` | Whitelist of allowed web origins (comma-separated) |
| `JWT_SECRET` | String | *Required* | Cryptographic salt/key for session validation |
| `UPLOAD_DIR` | String | `./uploads/documents` | Private filesystem directory for uploaded candidate files |
| `MAX_FILE_SIZE_BYTES` | Number | `5242880` | File upload ceiling in bytes (5MB) |
| `MAIL_HOST` | String | *Optional* | SMTP server hostname |
| `MAIL_PORT` | Number | `587` | SMTP port |
| `MAIL_USER` | String | *Optional* | SMTP username |
| `MAIL_PASSWORD` | String | *Optional* | SMTP password |
| `MAIL_FROM_ADDRESS` | String | `careers@volia.ng` | Sender email address for outgoing communications |
| `MAIL_FROM_NAME` | String | `"VOLIA NIG LTD"` | Sender display name |
| `NDPA_RETENTION_DAYS` | Number | `730` | Statutory retention period for candidate records (2 years) |
