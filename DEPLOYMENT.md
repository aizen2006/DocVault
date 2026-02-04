# DocVault Deployment Guide

## Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or MongoDB Atlas)
- Cloudinary account for file storage

## Environment Setup

### Backend

1. Copy the example environment file:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Configure all required environment variables in `.env`:
   - `MONGODB_URI`: Your MongoDB connection string
   - `ACCESS_TOKEN_SECRET` & `REFRESH_TOKEN_SECRET`: Strong random strings (use `openssl rand -base64 32`)
   - `COOKIE_SECRET`: Another strong random string for cookie signing
   - Cloudinary credentials from your Cloudinary dashboard
   - `CORS_ORIGIN`: Your frontend URL

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run in development:
   ```bash
   npm run dev
   ```

5. Run in production:
   ```bash
   npm start
   ```

### Frontend

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Configure the Vite proxy (already set up to proxy `/api` to backend)

3. Build for production:
   ```bash
   npm run build
   ```

## Production Deployment

### Backend Deployment Options

#### Option 1: Traditional Server (PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start index.js --name docvault-api

# Save PM2 process list
pm2 save

# Set up startup script
pm2 startup
```

#### Option 2: Docker

Create a `Dockerfile` in the backend directory:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
```

Build and run:
```bash
docker build -t docvault-api .
docker run -p 8000:8000 --env-file .env docvault-api
```

### Frontend Deployment

Build the frontend and serve with any static file server:

```bash
cd frontend
npm run build
# Output will be in the 'dist' folder
```

For production, serve with:
- Nginx
- Vercel
- Netlify
- Any CDN

## Health Checks

The backend provides a health check endpoint:

```
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-04T12:00:00.000Z",
  "uptime": 12345.67,
  "environment": "production",
  "version": "1.0.0",
  "database": {
    "status": "connected",
    "readyState": 1
  }
}
```

Use this endpoint for:
- Load balancer health checks
- Container orchestration (Kubernetes liveness/readiness probes)
- Monitoring systems (Prometheus, Datadog, etc.)

## Security Checklist

Before deploying to production:

- [ ] All secrets are strong, random values (not defaults)
- [ ] `NODE_ENV` is set to `production`
- [ ] HTTPS is enabled (via reverse proxy or load balancer)
- [ ] `CORS_ORIGIN` is set to the exact frontend domain
- [ ] MongoDB connection uses authentication
- [ ] Rate limiting is configured appropriately
- [ ] Logs are being collected and monitored
- [ ] Regular database backups are configured

## Monitoring Recommendations

1. **Application Monitoring**: Use the `/health` endpoint with uptime monitoring (UptimeRobot, Pingdom)

2. **Log Aggregation**: 
   - In production, consider replacing the basic logger with Winston/Pino
   - Send logs to a centralized service (Loggly, Papertrail, ELK stack)

3. **Error Tracking**: Integrate Sentry or similar for error tracking

4. **Performance Monitoring**: Consider APM tools like New Relic or Datadog

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Verify `MONGODB_URI` is correct
   - Check network/firewall rules
   - Ensure MongoDB is running

2. **CORS Errors**
   - Verify `CORS_ORIGIN` matches your frontend URL exactly
   - Check for trailing slashes

3. **File Upload Issues**
   - Verify Cloudinary credentials
   - Check file size limits (default: 10MB)
   - Ensure `public/temp` directory exists and is writable

4. **Authentication Issues**
   - Verify JWT secrets are set
   - Check cookie settings match your deployment (secure, sameSite)
   - For cross-domain deployments, ensure sameSite is set appropriately
