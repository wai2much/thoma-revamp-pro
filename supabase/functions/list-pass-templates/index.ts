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

    // Get all template IDs from database
    const { data: templates, error: dbError } = await supabaseClient
      .from("passentry_config")
      .select("*");

    if (dbError) throw dbError;
    console.log("[LIST-TEMPLATES] Found templates in DB:", templates);

    // Fetch detailed info for each template including field IDs
    const templateDetails = [];
    for (const template of templates || []) {
      try {
        console.log(`[LIST-TEMPLATES] Fetching template ${template.template_id} for ${template.tier_name}`);
        const response = await fetch(`https://api.passentry.com/api/v1/pass-templates/${template.template_id}`, {
          headers: {
            "Authorization": `Bearer ${passEntryKey}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const fields = data.data?.attributes?.fields || {};
          
          // Extract all field IDs from all sections
          const allFieldIds: string[] = [];
          for (const section of Object.values(fields)) {
            if (section && typeof section === 'object') {
              for (const field of Object.values(section as any)) {
                if (field && typeof field === 'object' && 'id' in field) {
                  allFieldIds.push((field as any).id);
                }
              }
            }
          }
          
          console.log(`[LIST-TEMPLATES] Template ${template.tier_name} has field IDs:`, allFieldIds);
          
          templateDetails.push({
            tier: template.tier_name,
            product_id: template.product_id,
            template_id: template.template_id,
            field_ids: [...new Set(allFieldIds)], // unique field IDs
            fields: fields,
            colors: data.data?.attributes?.colors || {},
            images: data.data?.attributes?.images || {}
          });
        } else {
          const errorText = await response.text();
          console.error(`[LIST-TEMPLATES] Failed to fetch template ${template.template_id}:`, errorText);
        }
      } catch (error) {
        console.error(`[LIST-TEMPLATES] Error fetching template ${template.template_id}:`, error);
      }
    }

    console.log("[LIST-TEMPLATES] All template details:", JSON.stringify(templateDetails, null, 2));

    return new Response(JSON.stringify({ templates: templateDetails }), {
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
