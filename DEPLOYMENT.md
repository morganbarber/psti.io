# Deployment Guide

## Overview

This project uses a single `.env.local` file to configure all services, making deployment flexible and straightforward. All apps (web, api, raw, docs) read from this shared configuration file.

## Quick Start

1. **Copy the environment template:**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure your ports** (or use defaults):
   ```env
   PORT_API=3001
   PORT_WEB=3000
   PORT_RAW=3002
   PORT_DOCS=3003
   ```

3. **Start all services:**
   ```bash
   npm run dev
   ```

## Port Configuration

All ports are configurable via environment variables with sensible defaults:

| Service | Environment Variable | Default Port | Description |
|---------|---------------------|--------------|-------------|
| API (NestJS) | `PORT` or `PORT_API` | 3001 | Backend API server |
| Web (Next.js) | `PORT_WEB` | 3000 | Main web application |
| Raw (Next.js) | `PORT_RAW` | 3002 | Raw paste viewer |
| Docs (Next.js) | `PORT_DOCS` | 3003 | Documentation site |

### Using Custom Ports

To use custom ports, simply set the environment variables in your `.env.local` file:

```env
# Example: Run all services on different ports
PORT_API=8001
PORT_WEB=8000
PORT_RAW=8002
PORT_DOCS=8003
```

The services will automatically use these ports when started.

## Running Services

### All Services Together

```bash
# Development mode
npm run dev
```

This runs all services concurrently using Turbo.

### Individual Services

Run specific services independently:

```bash
# API Server
cd apps/api && npm run dev

# Web Application
cd apps/web && npm run dev

# Raw Viewer
cd apps/raw && npm run dev

# Documentation
cd apps/docs && npm run dev
```

### Production Mode

```bash
# Build all applications
npm run build

# Start all services in production mode
npm run start
```

## Environment Variables

### Required Variables

Copy `.env.example` to `.env.local` in the root directory and configure:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Security (Required)
ENCRYPTION_KEY=your-32-byte-encryption-key-here
JWT_SECRET=your-jwt-secret-here
```

### Optional Variables

```env
# Port Configuration (optional - uses defaults if not set)
PORT_API=3001
PORT_WEB=3000
PORT_RAW=3002
PORT_DOCS=3003

# Rate Limiting (optional)
REDIS_URL=redis://localhost:6379

# Application URLs (auto-configured based on ports)
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RAW_URL=http://localhost:3002
NEXT_PUBLIC_DOCS_URL=http://localhost:3003
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Docker Deployment

When deploying with Docker, you can override ports using environment variables:

```yaml
# docker-compose.yml example
services:
  api:
    build: ./apps/api
    environment:
      - PORT=3001
    ports:
      - "3001:3001"
  
  web:
    build: ./apps/web
    environment:
      - PORT_WEB=3000
    ports:
      - "3000:3000"
  
  raw:
    build: ./apps/raw
    environment:
      - PORT_RAW=3002
    ports:
      - "3002:3002"
  
  docs:
    build: ./apps/docs
    environment:
      - PORT_DOCS=3003
    ports:
      - "3003:3003"
```

## Cloud Platform Deployment

### Vercel / Netlify

These platforms automatically handle port assignment. The Next.js apps don't require PORT configuration as the platform manages this.

Set only the essential environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL` (your API endpoint)
- `ENCRYPTION_KEY`
- `JWT_SECRET`

### Railway / Render / Fly.io

These platforms typically provide a `PORT` environment variable automatically. The API server will use it automatically:

```bash
# Railway/Render automatically sets PORT
# Your API will listen on the provided port
```

For the Next.js apps, set the specific port variables if needed:
- `PORT_WEB`
- `PORT_RAW`
- `PORT_DOCS`

## CORS Configuration

The API server automatically configures CORS based on the `NEXT_PUBLIC_APP_URL` environment variable:

```typescript
// apps/api/src/main.ts
app.enableCors({
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    credentials: true,
});
```

Make sure `NEXT_PUBLIC_APP_URL` matches your web application's URL in production.

## Troubleshooting

### Port Already in Use

If you see "port already in use" errors:

1. Check which process is using the port:
   ```bash
   lsof -i :3000
   ```

2. Either stop that process or change the port in your `.env.local`:
   ```env
   PORT_WEB=3100
   ```

### Environment Variables Not Loading

1. Ensure your `.env.local` file is in the project root (not in individual app directories)
2. **Restart your development server** after creating or modifying `.env.local`
3. Check that `.env.local` is in `.gitignore` (it should not be committed)

### Services Can't Connect

1. Verify all URL environment variables match your port configuration
2. Check that `NEXT_PUBLIC_API_URL` points to your API server
3. Ensure CORS is configured correctly in the API

## Best Practices

1. **Never commit `.env.local`**: Keep sensitive credentials out of version control
2. **Use `.env.example`**: Document all required variables for team members
3. **Default ports**: Use the standard defaults (3000-3003) for local development
4. **Production secrets**: Use your platform's secret management for production
5. **Document changes**: Update this file when adding new environment variables

## Support

For issues or questions:
- Check the [SETUP.md](./SETUP.md) guide
- Review application-specific README files
- Open an issue on the project repository
