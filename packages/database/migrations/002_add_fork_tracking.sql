-- Add fork_of column to pastes table
ALTER TABLE public.pastes
ADD COLUMN IF NOT EXISTS fork_of UUID REFERENCES public.pastes(id) ON DELETE SET NULL;

-- Create index for faster lookups of forks
CREATE INDEX IF NOT EXISTS idx_pastes_fork_of ON public.pastes(fork_of);
