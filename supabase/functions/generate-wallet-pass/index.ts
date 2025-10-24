import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCT_NAMES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "Single Pack",
  "prod_TIKmAWTileFjnm": "Family Pack",
  "prod_TIKmxYafsqTXwO": "Business Starter Pack",
  "prod_TIKmurHwJ5bDWJ": "Business Velocity Pack",
};

const PASSENTRY_TEMPLATE = "haus-tyreplus";

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
    console.log("[WALLET-PASS] Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw userError;
    
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    console.log("[WALLET-PASS] User authenticated", { email: user.email });

    // Get subscription details
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe key not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      throw new Error("No subscription found");
    }

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription");
    }

    const subscription = subscriptions.data[0];
    const productId = subscription.items.data[0].price.product as string;
    const planName = PRODUCT_NAMES[productId] || "Premium Member";
    
    const memberName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    const memberId = customerId.substring(0, 12).toUpperCase();
    const memberSince = new Date(subscription.created * 1000).getFullYear().toString();
    const validUntil = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : "Active";

    console.log("[WALLET-PASS] Generating PassEntry pass", { planName, memberId });

    // Create PassEntry wallet pass
    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${PASSENTRY_TEMPLATE}&includePassSource=apple`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pass: {
          memberName: { value: memberName },
          memberEmail: { value: user.email },
          planName: { value: planName },
          memberId: { value: memberId },
          memberSince: { value: memberSince },
          validUntil: { value: validUntil },
          barcode: {
            enabled: true,
            type: "qr",
            source: "custom",
            value: customerId,
            displayText: true
          }
        }
      }),
    });

    if (!passEntryResponse.ok) {
      const errorText = await passEntryResponse.text();
      console.error("[WALLET-PASS] PassEntry API error:", errorText);
      throw new Error(`PassEntry API error: ${passEntryResponse.status} - ${errorText}`);
    }

    const passData = await passEntryResponse.json();
    console.log("[WALLET-PASS] PassEntry pass created successfully", { passId: passData.data?.id });

    const downloadUrl = passData.data?.attributes?.downloadUrl;
    const passSource = passData.data?.attributes?.passSource;
    const appleUrl = passSource?.apple || downloadUrl;

    return new Response(JSON.stringify({
      success: true,
      passUrl: downloadUrl,
      appleWalletUrl: appleUrl,
      googlePayUrl: passSource?.google,
      membershipData: {
        memberName,
        memberEmail: user.email,
        planName,
        memberId,
        memberSince,
        validUntil,
      }
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[WALLET-PASS] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
