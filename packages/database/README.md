# Database Package

This package contains Supabase client utilities, TypeScript types, and database migrations.

## Setup

1. Create a Supabase project at https://supabase.com
2. Run the migration in `migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Configure environment variables in your apps

## Migrations

To apply migrations:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the migration file contents
4. Run the SQL

## Generating Types

To regenerate types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id <your-project-id> > src/types.ts
```

## Row Level Security

The database uses Row Level Security (RLS) to ensure data isolation:

- **Public pastes**: Viewable by everyone
- **Unlisted pastes**: Viewable by anyone with the link
- **Private pastes**: Only viewable by the owner
- **Folders**: Only accessible by the owner
- **User profiles**: Users can only view/edit their own profile

## Cleanup

A function `delete_expired_pastes()` is provided to clean up expired pastes. You should set up a cron job or Supabase Edge Function to run this periodically:

```sql
SELECT public.delete_expired_pastes();
```
