# 🔒 psti.io - Enterprise Pastebin for Security Professionals

A production-ready, security-focused pastebin application built with modern technologies and enterprise-level security features.

## 🏗️ Architecture

This is a Turborepo monorepo containing:

### Applications
- **web** - Next.js 16 frontend with App Router
- **api** - NestJS backend API
- **raw** - Minimal raw paste viewer

### Packages
- **@psti/database** - Supabase client and database utilities
- **@psti/ui** - Shared UI components (shadcn/ui)
- **@psti/auth** - Authentication utilities
- **@psti/validation** - Zod validation schemas
- **@psti/security** - Security utilities (encryption, sanitization)
- **@psti/types** - Shared TypeScript types
- **@psti/config** - Shared configuration
- **@psti/eslint-config** - Shared ESLint configuration

## 🚀 Features

### Core Functionality
- ✅ Create, view, edit, and delete pastes
- ✅ Syntax highlighting for 100+ languages
- ✅ Monaco editor integration
- ✅ Public, unlisted, and private pastes
- ✅ Password-protected pastes
- ✅ Expiration dates
- ✅ Burn after read
- ✅ Paste encryption (AES-256-GCM)
- ✅ Folders/collections
- ✅ Search functionality
- ✅ Raw paste viewer
- ✅ Download pastes
- ✅ Clone/fork pastes

### Security Features
- 🔐 Row Level Security (RLS) policies
- 🔐 End-to-end encryption for sensitive pastes
- 🔐 Rate limiting (IP and user-based)
- 🔐 XSS protection
- 🔐 CSRF protection
- 🔐 Content Security Policy
- 🔐 Secure headers (Helmet)
- 🔐 Input validation and sanitization
- 🔐 Audit logging
- 🔐 Password strength requirements

### Authentication
- 🔑 Email/password authentication
- 🔑 Email verification
- 🔑 Password reset
- 🔑 Session management
- 🔑 JWT tokens
- 🔑 API key generation

## 📋 Prerequisites

- Node.js 20+
- npm 10+
- Supabase account
- (Optional) Redis for distributed rate limiting

## 🛠️ Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/morganbarber/psti.io
   cd psti.io
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   ```

4. **Run database migrations**
   ```bash
   cd packages/database
   # Follow Supabase migration instructions
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Web app: http://localhost:3000
   - API: http://localhost:3001
   - Raw viewer: http://localhost:3002

## 📦 Build

```bash
npm run build
```

## 🧪 Testing

```bash
npm run test
```

## 📝 License

MIT

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.
