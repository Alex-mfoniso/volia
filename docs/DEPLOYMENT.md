# VOLIA NIG LTD — Production Deployment Guide

## 1. Prerequisites

- **Runtime:** Node.js 22 LTS or higher
- **Package Manager:** npm 10+
- **Reverse Proxy:** NGINX or Caddy
- **Process Manager:** PM2 or systemd
- **SSL Certificate:** Let's Encrypt Certbot

---

## 2. Environment Configuration

### Frontend `.env`
```bash
VITE_SITE_URL=https://volia.ng
VITE_APP_ENV=production
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api/v1
VITE_MAX_UPLOAD_SIZE_MB=5
```

### Backend `.env`
```bash
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://volia.ng
JWT_SECRET=replace_with_64_byte_random_hex_string
UPLOAD_DIR=./uploads/documents
MAX_FILE_SIZE_BYTES=5242880
MAIL_HOST=smtp.volia.ng
MAIL_PORT=587
MAIL_SECURE=false
MAIL_USER=careers@volia.ng
MAIL_PASSWORD=replace_with_smtp_credentials
MAIL_FROM_ADDRESS=careers@volia.ng
MAIL_FROM_NAME="VOLIA NIG LTD Recruitment Directorate"
NDPA_RETENTION_DAYS=730
```

---

## 3. Build & Deployment Commands

### Step 1: Install Dependencies
```bash
npm ci --production=false
```

### Step 2: Build Client Application
```bash
npm run build
```
Generates production assets in `dist/`.

### Step 3: Run Backend Service with PM2
```bash
pm2 start server/index.js --name "volia-backend" --node-args="--max-old-space-size=1024"
pm2 save
pm2 startup
```

---

## 4. NGINX Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name volia.ng www.volia.ng;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name volia.ng www.volia.ng;

    ssl_certificate /etc/letsencrypt/live/volia.ng/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/volia.ng/privkey.pem;

    # Static Frontend Assets
    root /var/www/volia/dist;
    index index.html;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Immutable Asset Caching
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # API Proxy to Express Backend
    location /api/ {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }

    # SPA Client Routing Fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

---

## 5. Rollback Procedure

1. **Client Rollback:**
   ```bash
   cp -r /var/www/volia/dist_previous /var/www/volia/dist
   nginx -s reload
   ```
2. **Backend Rollback:**
   ```bash
   git checkout <PREVIOUS_COMMIT_TAG>
   pm2 restart volia-backend
   ```
