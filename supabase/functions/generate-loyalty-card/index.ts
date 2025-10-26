import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PASSENTRY_TEMPLATE = "c1effedba2763ae003f66888";
const LOYALTY_PREFIX = "635BF"; // Stripe purple #635BFF

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
    console.log("[LOYALTY-CARD] Function started");

    const { name, email, phone } = await req.json();
    
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    console.log("[LOYALTY-CARD] Generating card for lead", { email, name });

    // Generate unique member ID with Stripe purple hex prefix
    const uniqueId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const memberId = `${LOYALTY_PREFIX}-${uniqueId}`;
    console.log("[LOYALTY-CARD] Generated member ID with Stripe hex prefix:", memberId);
    const memberSince = new Date().getFullYear().toString();

    // Create PassEntry loyalty card
    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${PASSENTRY_TEMPLATE}&includePassSource=apple`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: memberId,
        pass: {
          balanceLabel: { value: "LOYALTY BALANCE" },
          centralLabel: { value: "Welcome Card" },
          label1: { value: memberId },
          label2: { value: name },
          label3: { value: memberSince },
          label4: { value: "$20.00 CREDIT" },
          barcode: {
            enabled: true,
            type: "qr",
            source: "custom",
            value: `TYREPLUS-LOYALTY-${memberId}`,
            displayText: true
          }
        }
      }),
    });

    if (!passEntryResponse.ok) {
      const errorText = await passEntryResponse.text();
      console.error("[LOYALTY-CARD] PassEntry API error:", {
        status: passEntryResponse.status,
        statusText: passEntryResponse.statusText,
        body: errorText
      });
      throw new Error(`PassEntry API error: ${passEntryResponse.status} - ${errorText}`);
    }

    const passData = await passEntryResponse.json();
    console.log("[LOYALTY-CARD] Pass created successfully", { passId: passData.data?.id });

    const downloadUrl = passData.data?.attributes?.downloadUrl;
    const passSource = passData.data?.attributes?.passSource;
    const appleUrl = passSource?.apple || downloadUrl;

    return new Response(JSON.stringify({
      success: true,
      passUrl: downloadUrl,
      appleWalletUrl: appleUrl,
      googlePayUrl: passSource?.google,
      memberData: {
        memberName: name,
        memberEmail: email,
        memberPhone: phone,
        memberId,
        memberSince,
        credit: "$20.00"
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[LOYALTY-CARD] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});