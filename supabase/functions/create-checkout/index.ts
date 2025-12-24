import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  console.log("🔔 CREATE-CHECKOUT: Function invoked", {
    method: req.method,
    origin: req.headers.get("origin")
  });

  if (req.method === "OPTIONS") {
    console.log("✅ CREATE-CHECKOUT: Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    console.log("🔐 CREATE-CHECKOUT: Authenticating user...");
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header provided");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data, error: authError } = await supabaseClient.auth.getUser(token);
    
    if (authError) {
      console.error("❌ CREATE-CHECKOUT: Auth error:", authError);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const user = data.user;
    if (!user?.email) {
      throw new Error("User not authenticated or email not available");
    }
    console.log("✅ CREATE-CHECKOUT: User authenticated:", user.email);

    const body = await req.json();
    const { priceId, quantity = 1 } = body;
    console.log("📦 CREATE-CHECKOUT: Received body:", body);
    
    if (!priceId) {
      throw new Error("Price ID is required");
    }
    console.log("✅ CREATE-CHECKOUT: Using price ID:", priceId, "quantity:", quantity);

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("Stripe secret key not configured");
    }

    const stripe = new Stripe(stripeKey, { 
      apiVersion: "2025-08-27.basil" 
    });
    console.log("✅ CREATE-CHECKOUT: Stripe initialized");
    
    console.log("🔍 CREATE-CHECKOUT: Looking for existing customer...");
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    let customerId;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log("✅ CREATE-CHECKOUT: Found existing customer:", customerId);
    } else {
      console.log("ℹ️ CREATE-CHECKOUT: No existing customer, will create new one");
    }

    const origin = req.headers.get("origin") || "https://thoma-revamp-pro.lovable.app";
    console.log("🔗 CREATE-CHECKOUT: Creating checkout session with origin:", origin);

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : user.email,
      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "subscription",
      success_url: `${origin}/membership-success`,
      cancel_url: `${origin}/`,
    });

    console.log("✅ CREATE-CHECKOUT: Session created successfully:", session.id);
    console.log("🔗 CREATE-CHECKOUT: Checkout URL:", session.url);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("💥 CREATE-CHECKOUT ERROR:", errorMessage);
    console.error("💥 CREATE-CHECKOUT Stack:", error instanceof Error ? error.stack : "No stack trace");
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : undefined
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
