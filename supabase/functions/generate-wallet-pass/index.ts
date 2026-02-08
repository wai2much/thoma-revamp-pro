import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PASSKIT_API_BASE = "https://api.pub1.passkit.io";

const PRODUCT_NAMES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "Single Pack",
  "prod_TIKmAWTileFjnm": "Family Pack",
  "prod_TIKmxYafsqTXwO": "Business Starter Pack",
  "prod_TIKmurHwJ5bDWJ": "Business Velocity Pack",
};

const PRODUCT_PREFIXES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "00000",
  "prod_TIKmAWTileFjnm": "10B98",
  "prod_TIKmxYafsqTXwO": "0057B",
  "prod_TIKmurHwJ5bDWJ": "FFD70",
};

// --- PassKit JWT Auth ---

function base64url(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePassKitJWT(apiKey: string, apiSecret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    uid: apiKey,
    exp: now + 300, // 5 min expiry
    iat: now,
  };

  const encoder = new TextEncoder();
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  const signatureB64 = base64url(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

// --- PassKit Config from DB ---

interface PassKitConfig {
  programId: string;
  tierId: string;
}

async function getPassKitConfig(supabaseClient: any, productId: string): Promise<PassKitConfig | null> {
  const { data, error } = await supabaseClient
    .from("passentry_config")
    .select("passkit_program_id, passkit_tier_id")
    .eq("product_id", productId)
    .single();

  if (error || !data?.passkit_program_id || !data?.passkit_tier_id) {
    console.error("[WALLET-PASS] Error fetching PassKit config:", error);
    return null;
  }

  return {
    programId: data.passkit_program_id,
    tierId: data.passkit_tier_id,
  };
}

// --- PassKit Member Enrolment ---

async function enrolPassKitMember(
  jwt: string,
  config: PassKitConfig,
  memberData: {
    externalId: string;
    displayName: string;
    email: string;
    planName: string;
    expiryDate?: string;
  }
): Promise<{ passKitId: string; passUrl: string }> {
  const enrolPayload = {
    externalId: memberData.externalId,
    tierId: config.tierId,
    programId: config.programId,
    person: {
      displayName: memberData.displayName,
      emailAddress: memberData.email,
    },
    metaData: {
      plan: memberData.planName,
    },
    ...(memberData.expiryDate ? { expiryDate: memberData.expiryDate } : {}),
  };

  console.log("[WALLET-PASS] Enrolling member in PassKit:", JSON.stringify(enrolPayload));

  const response = await fetch(`${PASSKIT_API_BASE}/members/member`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${jwt}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(enrolPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("[WALLET-PASS] PassKit enrol error:", {
      status: response.status,
      body: errorText,
    });
    throw new Error(`PassKit enrol error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  const passKitId = result.id;
  console.log("[WALLET-PASS] PassKit member enrolled:", passKitId);

  // PassKit pass URL format
  const passUrl = `https://pub1.pskt.io/${passKitId}`;

  return { passKitId, passUrl };
}

// --- Main Handler ---

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
    console.log("[WALLET-PASS] User authenticated:", user.email);

    // Get Stripe subscription
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe key not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });

    if (customers.data.length === 0) throw new Error("No subscription found");

    const customerId = customers.data[0].id;
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 10,
    });

    if (subscriptions.data.length === 0) throw new Error("No active subscription");

    const subscription = subscriptions.data.sort((a: any, b: any) => b.created - a.created)[0];
    const subscriptionId = subscription.id;
    const productId = subscription.items.data[0].price.product as string;

    // Check for existing pass
    const { data: existingPass } = await supabaseClient
      .from("membership_passes")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .single();

    const planName = PRODUCT_NAMES[productId] || "Premium Member";
    const memberName = user.email.split("@")[0].charAt(0).toUpperCase() + user.email.split("@")[0].slice(1);
    const memberSince = new Date(subscription.created * 1000).getFullYear().toString();
    const validUntil = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit" })
      : "Active";

    if (existingPass) {
      console.log("[WALLET-PASS] Pass already exists, returning cached version");
      return new Response(JSON.stringify({
        success: true,
        passUrl: existingPass.download_url,
        appleWalletUrl: existingPass.apple_url,
        googlePayUrl: existingPass.google_url,
        membershipData: {
          memberName,
          memberEmail: user.email,
          planName,
          memberId: existingPass.member_id,
          memberSince,
          validUntil,
        },
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Generate member ID
    const hexPrefix = PRODUCT_PREFIXES[productId] || "00000";
    const uniqueId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const memberId = `${hexPrefix}-${uniqueId}`;
    console.log("[WALLET-PASS] Generated member ID:", memberId);

    // Get PassKit credentials
    const passkitApiKey = Deno.env.get("PASSKIT_API_KEY");
    const passkitApiSecret = Deno.env.get("PASSKIT_API_SECRET");
    if (!passkitApiKey || !passkitApiSecret) throw new Error("PassKit credentials not configured");

    // Get PassKit config from DB
    const passkitConfig = await getPassKitConfig(supabaseClient, productId);
    if (!passkitConfig) {
      throw new Error(`No PassKit config for product: ${productId}. Update passentry_config table with passkit_program_id and passkit_tier_id.`);
    }

    // Generate JWT for PassKit auth
    const jwt = await generatePassKitJWT(passkitApiKey, passkitApiSecret);
    console.log("[WALLET-PASS] PassKit JWT generated");

    // Calculate expiry date from subscription
    const expiryDate = subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : undefined;

    // Enrol member in PassKit
    const { passKitId, passUrl } = await enrolPassKitMember(jwt, passkitConfig, {
      externalId: memberId,
      displayName: memberName,
      email: user.email,
      planName,
      expiryDate,
    });

    // Save pass to database
    const { error: insertError } = await supabaseClient
      .from("membership_passes")
      .insert({
        user_id: user.id,
        member_id: memberId,
        pass_id: passKitId,
        apple_url: passUrl,
        google_url: passUrl,
        download_url: passUrl,
        subscription_id: subscriptionId,
        product_id: productId,
      });

    if (insertError) {
      console.error("[WALLET-PASS] Error saving pass:", insertError);
    } else {
      console.log("[WALLET-PASS] Pass saved to database");
    }

    // Send confirmation email
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        await resend.emails.send({
          from: "TyrePlus Membership <onboarding@resend.dev>",
          to: [user.email],
          subject: "Your TyrePlus Membership Pass is Ready!",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">Welcome to TyrePlus, ${memberName}!</h1>
              <p>Your digital membership pass has been created and is ready to use.</p>
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin-top: 0;">Membership Details</h2>
                <p><strong>Plan:</strong> ${planName}</p>
                <p><strong>Member ID:</strong> ${memberId}</p>
                <p><strong>Member Since:</strong> ${memberSince}</p>
                <p><strong>Valid Until:</strong> ${validUntil}</p>
              </div>
              <div style="margin: 30px 0;">
                <h3>Add to Your Wallet:</h3>
                <p><a href="${passUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Add to Wallet</a></p>
              </div>
              <p style="color: #666; font-size: 14px;">
                Thank you for choosing TyrePlus. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        });
        console.log("[WALLET-PASS] Confirmation email sent");
      } catch (emailError) {
        console.error("[WALLET-PASS] Email failed (non-blocking):", emailError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      passUrl,
      appleWalletUrl: passUrl,
      googlePayUrl: passUrl,
      membershipData: {
        memberName,
        memberEmail: user.email,
        planName,
        memberId,
        memberSince,
        validUntil,
      },
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
