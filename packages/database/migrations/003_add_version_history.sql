-- Create paste_versions table
CREATE TABLE IF NOT EXISTS public.paste_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paste_id UUID NOT NULL REFERENCES public.pastes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'plaintext',
  encrypted BOOLEAN NOT NULL DEFAULT FALSE,
  encryption_iv TEXT,
  encryption_auth_tag TEXT,
  encryption_salt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying versions by paste
CREATE INDEX IF NOT EXISTS idx_paste_versions_paste_id ON public.paste_versions(paste_id);
CREATE INDEX IF NOT EXISTS idx_paste_versions_created_at ON public.paste_versions(created_at DESC);

-- Trigger function to save versions
CREATE OR REPLACE FUNCTION save_paste_version()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT, always save. On UPDATE, only save if core content changed.
  IF TG_OP = 'INSERT' OR 
     (TG_OP = 'UPDATE' AND (
        OLD.content IS DISTINCT FROM NEW.content OR 
        OLD.title IS DISTINCT FROM NEW.title OR 
        OLD.language IS DISTINCT FROM NEW.language
     )) THEN
    INSERT INTO public.paste_versions (paste_id, title, content, language, encrypted, encryption_iv, encryption_auth_tag, encryption_salt, created_at)
    VALUES (NEW.id, NEW.title, NEW.content, NEW.language, NEW.encrypted, NEW.encryption_iv, NEW.encryption_auth_tag, NEW.encryption_salt, NOW());
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to pastes
CREATE TRIGGER on_paste_version_changed
  AFTER INSERT OR UPDATE ON public.pastes
  FOR EACH ROW EXECUTE FUNCTION save_paste_version();

-- Enable RLS on paste_versions
ALTER TABLE public.paste_versions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view versions if they can view the parent paste
CREATE POLICY "Users can view versions if they have access to parent paste"
  ON public.paste_versions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.pastes
      WHERE pastes.id = paste_versions.paste_id
      AND (
        (pastes.visibility = 'public' AND (pastes.expires_at IS NULL OR pastes.expires_at > NOW())) OR
        (pastes.visibility = 'unlisted' AND (pastes.expires_at IS NULL OR pastes.expires_at > NOW())) OR
        (pastes.visibility = 'private' AND auth.uid() = pastes.user_id AND (pastes.expires_at IS NULL OR pastes.expires_at > NOW()))
      )
    )
  );
