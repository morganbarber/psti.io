-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Folders table
CREATE TABLE IF NOT EXISTS public.folders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Pastes table
CREATE TABLE IF NOT EXISTS public.pastes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'plaintext',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted', 'private')),
  password_hash TEXT,
  expires_at TIMESTAMPTZ,
  encrypted BOOLEAN NOT NULL DEFAULT FALSE,
  encryption_iv TEXT,
  encryption_auth_tag TEXT,
  encryption_salt TEXT,
  burn_after_read BOOLEAN NOT NULL DEFAULT FALSE,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  folder_id UUID REFERENCES public.folders(id) ON DELETE SET NULL
);

-- Paste views tracking table
CREATE TABLE IF NOT EXISTS public.paste_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paste_id UUID NOT NULL REFERENCES public.pastes(id) ON DELETE CASCADE,
  viewer_ip TEXT,
  viewer_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pastes_user_id ON public.pastes(user_id);
CREATE INDEX IF NOT EXISTS idx_pastes_visibility ON public.pastes(visibility);
CREATE INDEX IF NOT EXISTS idx_pastes_created_at ON public.pastes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pastes_expires_at ON public.pastes(expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_pastes_folder_id ON public.pastes(folder_id);
CREATE INDEX IF NOT EXISTS idx_folders_user_id ON public.folders(user_id);
CREATE INDEX IF NOT EXISTS idx_paste_views_paste_id ON public.paste_views(paste_id);

-- Full text search index for paste content
CREATE INDEX IF NOT EXISTS idx_pastes_content_search ON public.pastes USING gin(to_tsvector('english', title || ' ' || content));

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pastes_updated_at BEFORE UPDATE ON public.pastes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON public.folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to clean up expired pastes
CREATE OR REPLACE FUNCTION public.delete_expired_pastes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.pastes
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pastes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.paste_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for pastes table
CREATE POLICY "Public pastes are viewable by everyone"
  ON public.pastes FOR SELECT
  USING (
    visibility = 'public'
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Unlisted pastes are viewable by anyone with the link"
  ON public.pastes FOR SELECT
  USING (
    visibility = 'unlisted'
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Private pastes are viewable only by owner"
  ON public.pastes FOR SELECT
  USING (
    visibility = 'private'
    AND auth.uid() = user_id
    AND (expires_at IS NULL OR expires_at > NOW())
  );

CREATE POLICY "Anonymous users can create pastes"
  ON public.pastes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can create pastes"
  ON public.pastes FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own pastes"
  ON public.pastes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pastes"
  ON public.pastes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for folders table
CREATE POLICY "Users can view their own folders"
  ON public.folders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders"
  ON public.folders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders"
  ON public.folders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders"
  ON public.folders FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for paste_views table
CREATE POLICY "Anyone can insert paste views"
  ON public.paste_views FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own paste views"
  ON public.paste_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pastes
      WHERE pastes.id = paste_views.paste_id
      AND pastes.user_id = auth.uid()
    )
  );
