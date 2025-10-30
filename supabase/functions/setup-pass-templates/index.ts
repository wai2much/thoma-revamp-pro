import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Template configurations for each tier
const TIER_CONFIGS = [
  {
    name: "TyrePlus Single Pack",
    productId: "prod_TIKlo107LUfRkP",
    backgroundColor: "#000000",
    labelColor: "#FFFFFF",
    textColor: "#FFFFFF",
    tierName: "Single Pack",
  },
  {
    name: "TyrePlus Family Pack",
    productId: "prod_TIKmAWTileFjnm",
    backgroundColor: "#10B981",
    labelColor: "#FFFFFF",
    textColor: "#FFFFFF",
    tierName: "Family Pack",
  },
  {
    name: "TyrePlus Business Starter",
    productId: "prod_TIKmxYafsqTXwO",
    backgroundColor: "#0057B8",
    labelColor: "#FFFFFF",
    textColor: "#FFFFFF",
    tierName: "Business Starter Pack",
  },
  {
    name: "TyrePlus Business Velocity",
    productId: "prod_TIKmurHwJ5bDWJ",
    backgroundColor: "#FFD700",
    labelColor: "#000000",
    textColor: "#000000",
    tierName: "Business Velocity Pack",
  },
];

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
    console.log("[SETUP-TEMPLATES] Function started");

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    console.log("[SETUP-TEMPLATES] User authenticated", { email: user.email });

    // Get PassEntry API key
    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    const createdTemplates: Record<string, string> = {};

    // Create templates for each tier
    for (const config of TIER_CONFIGS) {
      console.log(`[SETUP-TEMPLATES] Creating template for ${config.tierName}`);

      const templatePayload = {
        passTemplate: {
          name: config.name,
          templateType: "generic",
          defaultLanguage: "en",
          centralTitle: "TyrePlus",
          notificationHeader: "TyrePlus Membership",
          description: `${config.tierName} Membership`,
          colors: {
            background: config.backgroundColor,
            label: config.labelColor,
            text: config.textColor,
          },
          fields: {
            auxiliary: {
              one: {
                id: "name",
                label: "Name",
                defaultValue: "Member",
              },
              two: {
                id: "subscription",
                label: "Subscription",
                defaultValue: config.tierName,
              },
              three: {
                id: "rego",
                label: "Rego",
                defaultValue: "00000-XXXXXX",
              },
              four: {
                id: "uuid",
                label: "UUID",
                defaultValue: "XXXX-XXXX",
              },
            },
            secondary: {
              one: {
                id: "colour",
                label: "Colour",
                defaultValue: config.backgroundColor,
              },
            },
          },
          images: {
            stripImage: {
              default: "https://64a7bebe-dd72-4b4c-ba13-a98f02a39d2a.lovableproject.com/assets/pass-banner-1.png",
            },
          },
        },
      };

      const response = await fetch("https://api.passentry.com/api/v1/pass-templates", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${passEntryKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templatePayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SETUP-TEMPLATES] Error creating template for ${config.tierName}:`, errorText);
        throw new Error(`Failed to create template for ${config.tierName}: ${response.status} - ${errorText}`);
      }

      const templateData = await response.json();
      const templateId = templateData.data?.id;
      
      if (!templateId) {
        throw new Error(`No template ID returned for ${config.tierName}`);
      }

      createdTemplates[config.productId] = templateId;
      console.log(`[SETUP-TEMPLATES] Created template for ${config.tierName}:`, templateId);
    }

    console.log("[SETUP-TEMPLATES] All templates created successfully");

    return new Response(JSON.stringify({
      success: true,
      message: "All pass templates created successfully",
      templates: createdTemplates,
      instructions: "Copy these template IDs and update the TEMPLATE_IDS mapping in generate-wallet-pass function",
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[SETUP-TEMPLATES] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
