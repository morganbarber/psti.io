# AI Agents Documentation

This repository is designed to be friendly to AI agents.

## Architecture
The project is a Turborepo monorepo with the following structure:
- `apps/web`: Next.js 16 frontend
- `apps/api`: NestJS backend
- `apps/raw`: Raw paste viewer
- `apps/docs`: Documentation for API, contributing, and usage.
- `packages/*`: Shared packages

## Conventions
- **Package Manager**: npm
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase
- **ORM**: None (Direct Supabase Client)
- **Validation**: Zod

## Key Files
- `turbo.json`: Build pipeline configuration
- `apps/web/next.config.js`: Frontend configuration
- `packages/database/src/client.ts`: Database client instantiation

## Do's and Don'ts
- **Do** use absolute paths when referencing files in tool calls.
- **Do** run `npm run build` to verify changes.
- **Do** run `npm run lint` to verify your code meets our quality standards.
- **Don't** modify `.gitignore` unless necessary.
- **Don't** hardcode secrets.
