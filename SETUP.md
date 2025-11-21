# 🔒 psti.io - Enterprise Pastebin Setup Guide

This guide will help you set up and run the psti.io application locally.

## Prerequisites

- Node.js 20+ and npm 10+
- A Supabase account (free tier works)
- Git

## Step 1: Clone and Install

```bash
# Clone the repository (if not already done)
cd pastebin

# Install all dependencies
npm install
```

## Step 2: Set Up Supabase

1. **Create a Supabase Project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose a name and password
   - Wait for the project to be created

2. **Run Database Migration**
   - In your Supabase dashboard, go to "SQL Editor"
   - Copy the contents of `packages/database/migrations/001_initial_schema.sql`
   - Paste and run the SQL

3. **Get Your Credentials**
   - Go to Project Settings > API
   - Copy the following:
     - Project URL
     - `anon` public key
     - `service_role` secret key (⚠️ Keep this secret!)

## Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# API Configuration
API_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:3001

# Security
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Application
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_RAW_URL=http://localhost:3002
```

**Generate Encryption Keys:**
```bash
# Generate a secure encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `ENCRYPTION_KEY` and `JWT_SECRET`.

## Step 4: Start Development Servers

Open **three terminal windows** and run:

### Terminal 1: Frontend (Next.js)
```bash
cd apps/web
npm run dev
```
This starts the main web app at http://localhost:3000

### Terminal 2: API (NestJS)
```bash
cd apps/api
npm run dev
```
This starts the API server at http://localhost:3001

### Terminal 3: Raw Viewer (Next.js)
```bash
cd apps/raw
npm run dev
```
This starts the raw paste viewer at http://localhost:3002

**OR** use Turborepo to run all at once:
```bash
npm run dev
```

## Step 5: Test the Application

1. **Open the Web App**
   - Navigate to http://localhost:3000
   - You should see the landing page

2. **Create an Account**
   - Click "Sign Up"
   - Enter your email and password
   - Check your email for verification link
   - Click the verification link

3. **Create a Paste**
   - Click "New Paste"
   - Enter some code
   - Configure settings (visibility, encryption, etc.)
   - Click "Create Paste"

4. **View API Documentation**
   - Navigate to http://localhost:3001/api/docs
   - Explore the Swagger API documentation

## Architecture Overview

```
pastebin/
├── apps/
│   ├── web/          # Next.js 15 frontend (port 3000)
│   ├── api/          # NestJS backend (port 3001)
│   └── raw/          # Raw paste viewer (port 3002)
├── packages/
│   ├── database/     # Supabase client & migrations
│   ├── ui/           # shadcn/ui components
│   ├── auth/         # Authentication utilities
│   ├── validation/   # Zod schemas
│   ├── security/     # Encryption & sanitization
│   ├── types/        # TypeScript types
│   └── config/       # Shared configuration
```

## Security Features

✅ **Row Level Security (RLS)** - Database-level access control
✅ **AES-256-GCM Encryption** - For sensitive pastes
✅ **Password Protection** - Optional password for pastes
✅ **Rate Limiting** - Prevents abuse
✅ **XSS Protection** - Input sanitization
✅ **CSRF Protection** - Secure headers
✅ **Helmet** - Security headers
✅ **Burn After Read** - Self-destructing pastes
✅ **Expiration** - Automatic paste deletion

## Common Issues

### "Missing Supabase environment variables"
- Make sure you've created the `.env` file
- Verify all Supabase credentials are correct

### "Database error" or "RLS policy violation"
- Ensure you've run the database migration
- Check that RLS policies are enabled

### Port already in use
- Change ports in package.json scripts
- Or kill the process using the port

### Dependencies not installing
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Production Deployment

For production deployment:

1. **Build all apps:**
   ```bash
   npm run build
   ```

2. **Set production environment variables**

3. **Deploy:**
   - Frontend (web): Vercel, Netlify, or any Node.js host
   - API: Railway, Render, or any Node.js host
   - Raw viewer: Same as frontend

4. **Configure CORS** in API to allow your production domain

## Next Steps

- [ ] Customize the theme in `packages/ui/src/globals.css`
- [ ] Add more languages to `packages/config/src/index.ts`
- [ ] Set up a cron job to delete expired pastes
- [ ] Configure email templates in Supabase
- [ ] Add analytics and monitoring

## Support

For issues or questions:
- Check the implementation plan in `.gemini/antigravity/brain/`
- Review the database schema in `packages/database/migrations/`
- Check API documentation at http://localhost:3001/api/docs

---

Built with ❤️ for security professionals
