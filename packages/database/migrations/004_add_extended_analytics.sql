-- Add extended analytics columns to paste_views table
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS referrer TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS os TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS language TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS screen_resolution TEXT;
ALTER TABLE public.paste_views ADD COLUMN IF NOT EXISTS timezone TEXT;

-- Index for analytics querying
CREATE INDEX IF NOT EXISTS idx_paste_views_browser ON public.paste_views(browser);
CREATE INDEX IF NOT EXISTS idx_paste_views_os ON public.paste_views(os);
CREATE INDEX IF NOT EXISTS idx_paste_views_device_type ON public.paste_views(device_type);
CREATE INDEX IF NOT EXISTS idx_paste_views_viewed_at ON public.paste_views(viewed_at DESC);
