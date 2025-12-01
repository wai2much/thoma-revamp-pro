-- Create memories table for AI long-term memory
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

-- Allow service role (API/edge functions) to read/write
CREATE POLICY "Service role can manage memories"
ON public.memories
FOR ALL
USING (true);