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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // 1. Deactivate expired trial licenses
    const { data: expiredLicenses, error: expError } = await supabase
      .from('licenses')
      .update({ is_active: false })
      .eq('license_type', 'trial')
      .eq('is_active', true)
      .lt('expires_at', new Date().toISOString())
      .select();

    // 2. Find users without any license and create trial
    const { data: allUsers } = await supabase.auth.admin.listUsers();
    const { data: existingLicenses } = await supabase
      .from('licenses')
      .select('user_id');

    const usersWithLicense = new Set((existingLicenses || []).map(l => l.user_id));
    const usersWithoutLicense = (allUsers?.users || []).filter(u => !usersWithLicense.has(u.id));

    let created = 0;
    for (const user of usersWithoutLicense) {
      await supabase.from('licenses').insert({
        user_id: user.id,
        license_type: 'trial',
        started_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });
      created++;
    }

    return new Response(JSON.stringify({
      success: true,
      deactivated: expiredLicenses?.length || 0,
      created,
      timestamp: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
