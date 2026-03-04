CREATE TABLE public.license_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  license_type text NOT NULL DEFAULT 'monthly',
  duration_days integer NOT NULL DEFAULT 30,
  is_used boolean NOT NULL DEFAULT false,
  used_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  used_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.license_codes ENABLE ROW LEVEL SECURITY;

-- Only allow service role to manage codes (admin via edge function)
CREATE POLICY "Service role full access" ON public.license_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);