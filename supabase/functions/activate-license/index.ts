import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get user from token
    const supabaseUser = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { code } = await req.json();
    if (!code || typeof code !== 'string' || code.trim().length < 4 || code.trim().length > 50) {
      return new Response(JSON.stringify({ error: 'Kode lisensi tidak valid' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const cleanCode = code.trim().toUpperCase();

    // Use service role for DB operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Find the code
    const { data: licenseCode, error: findError } = await supabase
      .from('license_codes')
      .select('*')
      .eq('code', cleanCode)
      .single();

    if (findError || !licenseCode) {
      return new Response(JSON.stringify({ error: 'Kode lisensi tidak ditemukan' }), {
        status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (licenseCode.is_used) {
      return new Response(JSON.stringify({ error: 'Kode lisensi sudah digunakan' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + licenseCode.duration_days * 24 * 60 * 60 * 1000);

    // Mark code as used
    await supabase.from('license_codes').update({
      is_used: true, used_by: user.id, used_at: now.toISOString(),
    }).eq('id', licenseCode.id);

    // Update or create user license
    const { data: existingLicense } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (existingLicense) {
      await supabase.from('licenses').update({
        license_type: licenseCode.license_type,
        started_at: now.toISOString(),
        expires_at: licenseCode.license_type === 'lifetime' 
          ? new Date('2099-12-31').toISOString() 
          : expiresAt.toISOString(),
        is_active: true,
      }).eq('id', existingLicense.id);
    } else {
      await supabase.from('licenses').insert({
        user_id: user.id,
        license_type: licenseCode.license_type,
        started_at: now.toISOString(),
        expires_at: licenseCode.license_type === 'lifetime'
          ? new Date('2099-12-31').toISOString()
          : expiresAt.toISOString(),
        is_active: true,
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: 'Lisensi berhasil diaktifkan!',
      license_type: licenseCode.license_type,
      expires_at: licenseCode.license_type === 'lifetime'
        ? '2099-12-31'
        : expiresAt.toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
