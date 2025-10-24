import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    console.log("[LIST-TEMPLATES] Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    console.log("[LIST-TEMPLATES] User authenticated", { email: user.email });

    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    // List all pass templates
    const response = await fetch("https://api.passentry.com/api/v1/pass-templates", {
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PassEntry API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("[LIST-TEMPLATES] Templates retrieved", { count: data.data?.length });

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[LIST-TEMPLATES] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
