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
    console.log("[CREATE-LOYALTY-TEMPLATE] Starting template creation");

    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    // Create loyalty card template
    const templatePayload = {
      passTemplate: {
        name: "TyrePlus Loyalty Card",
        templateType: "generic",
        centralTitle: "TyrePlus Loyalty",
        notificationHeader: "TyrePlus Loyalty Card",
        description: "TyrePlus Loyalty Card - Earn rewards and save on tyres",
        colors: {
          background: "#D4AF37",
          label: "#333333",
          text: "#000000"
        },
        fields: {
          central: {
            one: {
              id: "memberName",
              label: "Member",
              defaultValue: "Loyalty Member"
            }
          },
          auxiliary: {
            one: {
              id: "balanceLabel",
              label: "Points",
              defaultValue: "0"
            },
            two: {
              id: "centralLabel",
              label: "Welcome Credit",
              defaultValue: "$20"
            },
            three: {
              id: "label1",
              label: "Member ID",
              defaultValue: "0000"
            },
            four: {
              id: "label2",
              label: "Name",
              defaultValue: "Member"
            }
          },
          back: {
            one: {
              id: "label3",
              label: "Member Since",
              defaultValue: "2025"
            },
            two: {
              id: "label4",
              label: "Valid Until",
              defaultValue: "2026"
            }
          }
        },
        images: {
          stripImage: {
            default: "https://64a7bebe-dd72-4b4c-ba13-a98f02a39d2a.lovableproject.com/assets/banner-speed-branded.png"
          }
        }
      }
    };

    console.log("[CREATE-LOYALTY-TEMPLATE] Creating template with PassEntry...");
    
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
      console.error("[CREATE-LOYALTY-TEMPLATE] PassEntry API error:", {
        status: response.status,
        body: errorText
      });
      throw new Error(`PassEntry API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const templateId = data.data?.id;
    
    console.log("[CREATE-LOYALTY-TEMPLATE] Template created:", templateId);

    // Save to database
    const { error: dbError } = await supabaseClient
      .from('passentry_config')
      .upsert({
        product_id: 'loyalty_card',
        template_id: templateId,
        tier_name: 'Loyalty Card'
      }, {
        onConflict: 'product_id'
      });

    if (dbError) {
      console.error("[CREATE-LOYALTY-TEMPLATE] Database error:", dbError);
      throw dbError;
    }

    console.log("[CREATE-LOYALTY-TEMPLATE] Template saved to database");

    return new Response(JSON.stringify({
      success: true,
      templateId,
      message: "Loyalty card template created successfully"
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[CREATE-LOYALTY-TEMPLATE] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
