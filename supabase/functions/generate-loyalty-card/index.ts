import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PASSENTRY_TEMPLATE = "c1effedba2763ae003f66888";
const LOYALTY_PREFIX = "635BF"; // Stripe purple #635BFF

// Car banner images for random selection (1125px x 432px) - branded with Business Velocity Pack
const CAR_BANNERS = [
  "banner-speed-branded.png",
  "banner-city-sunset-branded.png",
  "banner-racing-sunset-branded.png"
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
    console.log("[LOYALTY-CARD] Function started");

    const { name, email, phone } = await req.json();
    
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    console.log("[LOYALTY-CARD] Generating card for lead", { email, name });

    // Generate unique member ID (simple numeric for loyalty card)
    const memberId = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("[LOYALTY-CARD] Generated member ID:", memberId);
    
    // Member since as month name
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                       "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const memberSince = monthNames[new Date().getMonth()];
    
    // Set validity to 1 year from now
    const validUntil = new Date();
    validUntil.setFullYear(validUntil.getFullYear() + 1);
    const validity = validUntil.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Create PassEntry loyalty card
    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    // Randomly select a car banner
    const randomBanner = CAR_BANNERS[Math.floor(Math.random() * CAR_BANNERS.length)];
    const origin = req.headers.get("origin") || "https://lnfmxpcpudugultrpwwa.lovableproject.com";
    const bannerUrl = `${origin}/assets/${randomBanner}`;
    console.log("[LOYALTY-CARD] Using random banner:", bannerUrl);

    const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${PASSENTRY_TEMPLATE}&includePassSource=apple`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: memberId,
        pass: {
          stripImage: bannerUrl,                // Random car banner
          balanceLabel: { value: "99" },        // Loyalty points
          centralLabel: { value: "$20 Welcome Card" },
          label1: { value: memberId },
          label2: { value: name.toUpperCase() },
          label3: { value: memberSince },
          label4: { value: validity },
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