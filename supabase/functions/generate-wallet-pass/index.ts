import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { Resend } from "https://esm.sh/resend@2.0.0";

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

// Map Stripe product IDs to 5-character hex prefixes (from tier colors)
const PRODUCT_PREFIXES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "00000",  // Single Pack - #000000
  "prod_TIKmAWTileFjnm": "10B98",  // Family Pack - #10B981
  "prod_TIKmxYafsqTXwO": "0057B",  // Business Starter - #0057B8
  "prod_TIKmurHwJ5bDWJ": "FFD70",  // Business Velocity - #FFD700
};

// Map Stripe product IDs to full hex colors for pass backgrounds
const PRODUCT_COLORS: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "#000000",  // Single Pack - Black
  "prod_TIKmAWTileFjnm": "#10B981",  // Family Pack - Green
  "prod_TIKmxYafsqTXwO": "#0057B8",  // Business Starter - Blue
  "prod_TIKmurHwJ5bDWJ": "#FFD700",  // Business Velocity - Gold
};

// Function to get template ID from database
async function getTemplateId(supabaseClient: any, productId: string): Promise<string | null> {
  const { data, error } = await supabaseClient
    .from("passentry_config")
    .select("template_id")
    .eq("product_id", productId)
    .single();

  if (error) {
    console.error("[WALLET-PASS] Error fetching template ID:", error);
    return null;
  }

  return data?.template_id || null;
}

// Car banner images for random selection (1125px x 432px)
const CAR_BANNERS = [
  "banner-speed.png",
  "banner-sunset-water.png",
  "banner-city-sunset.png",
  "banner-red-smoke.png",
  "banner-supercar-rear.png",
  "banner-racing-sunset.png",
  "banner-sports.png", 
  "banner-super-gt.png"
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
      limit: 10, // Get all active subscriptions
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription");
    }

    // Get the most recent subscription (sorted by created date)
    const subscription = subscriptions.data.sort((a: any, b: any) => b.created - a.created)[0];
    const subscriptionId = subscription.id;
    const productId = subscription.items.data[0].price.product as string;

    // Check if pass already exists in database
    const { data: existingPass } = await supabaseClient
      .from("membership_passes")
      .select("*")
      .eq("subscription_id", subscriptionId)
      .single();

    if (existingPass) {
      console.log("[WALLET-PASS] Pass already exists, returning cached version");
      return new Response(JSON.stringify({
        success: true,
        passUrl: existingPass.download_url,
        appleWalletUrl: existingPass.apple_url,
        googlePayUrl: existingPass.google_url,
        membershipData: {
          memberName: user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1),
          memberEmail: user.email,
          planName: PRODUCT_NAMES[productId] || "Premium Member",
          memberId: existingPass.member_id,
          memberSince: new Date(subscription.created * 1000).getFullYear().toString(),
          validUntil: subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
            : "Active",
        }
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }
    const planName = PRODUCT_NAMES[productId] || "Premium Member";
    
    const memberName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    
    // Generate unique member ID with hex prefix based on product tier
    const hexPrefix = PRODUCT_PREFIXES[productId] || "00000";
    const uniqueId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const memberId = `${hexPrefix}-${uniqueId}`;
    console.log("[WALLET-PASS] Generated member ID with hex prefix:", memberId, "for product:", productId);
    
    const memberSince = new Date(subscription.created * 1000).getFullYear().toString();
    const validUntil = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : "Active";

    console.log("[WALLET-PASS] Generating PassEntry pass", { planName, memberId });

    // Create PassEntry wallet pass
    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (!passEntryKey) throw new Error("PassEntry API key not configured");

    // Get tier color for pass background
    const tierColor = PRODUCT_COLORS[productId] || "#1C1C1C";
    console.log("[WALLET-PASS] Using tier color:", tierColor, "for product:", productId);

    // Randomly select a car banner
    const randomBanner = CAR_BANNERS[Math.floor(Math.random() * CAR_BANNERS.length)];
    const origin = req.headers.get("origin") || "https://lnfmxpcpudugultrpwwa.lovableproject.com";
    const bannerUrl = `${origin}/assets/${randomBanner}`;
    console.log("[WALLET-PASS] Using random banner:", bannerUrl);

    // Get tier-specific template ID from database
    const templateId = await getTemplateId(supabaseClient, productId);
    if (!templateId) {
      throw new Error(`No template configured for product: ${productId}. Please configure templates at /passentry-setup`);
    }
    console.log("[WALLET-PASS] Using template:", templateId, "for product:", productId);

    // DIAGNOSTIC: Fetch template details to see actual field IDs
    try {
      const templateResponse = await fetch(`https://api.passentry.com/api/v1/pass-templates/${templateId}`, {
        headers: { "Authorization": `Bearer ${passEntryKey}` }
      });
      
      if (templateResponse.ok) {
        const templateData = await templateResponse.json();
        const fields = templateData.data?.attributes?.fields || {};
        
        // Extract all field IDs
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
        
        console.log("[WALLET-PASS] DIAGNOSTIC - Template field IDs available:", [...new Set(allFieldIds)]);
        console.log("[WALLET-PASS] DIAGNOSTIC - Full template fields structure:", JSON.stringify(fields, null, 2));
      }
    } catch (diagError) {
      console.error("[WALLET-PASS] Failed to fetch template for diagnostics:", diagError);
    }

    // Create PassEntry wallet pass - include metadata for webhook
    // Note: Custom fields must be wrapped in { value: "..." } format
    // Map to actual template field IDs (with exact casing and spaces!)
    const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${templateId}&includePassSource=apple,google`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: memberId,
        pass: {
          stripImage: bannerUrl,
          backgroundColor: tierColor,
          member_name: memberName.toUpperCase(),
          member_id: memberId,
          Custom: memberSince,
          tier_name: planName.toUpperCase()
        },
        metadata: {
          user_id: user.id,
          subscription_id: subscriptionId,
          product_id: productId,
        }
      }),
    });

    if (!passEntryResponse.ok) {
      const errorText = await passEntryResponse.text();
      console.error("[WALLET-PASS] PassEntry API error:", {
        status: passEntryResponse.status,
        statusText: passEntryResponse.statusText,
        body: errorText,
        url: passEntryResponse.url
      });
      throw new Error(`PassEntry API error: ${passEntryResponse.status} - ${errorText}`);
    }

    const passData = await passEntryResponse.json();
    console.log("[WALLET-PASS] PassEntry pass created successfully", { passId: passData.data?.id });

    const downloadUrl = passData.data?.attributes?.downloadUrl;
    const passSource = passData.data?.attributes?.passSource;
    const appleUrl = passSource?.apple || downloadUrl;

    // Save pass to database
    const { error: insertError } = await supabaseClient
      .from("membership_passes")
      .insert({
        user_id: user.id,
        member_id: memberId,
        pass_id: passData.data?.id,
        apple_url: appleUrl,
        google_url: passSource?.google,
        download_url: downloadUrl,
        subscription_id: subscriptionId,
        product_id: productId,
      });

    if (insertError) {
      console.error("[WALLET-PASS] Error saving pass to database:", insertError);
      // Don't throw - pass was created successfully, just log the error
    } else {
      console.log("[WALLET-PASS] Pass saved to database successfully");
    }

    // Send confirmation email
    console.log("[WALLET-PASS] Starting email send process");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        console.log("[WALLET-PASS] Resend initialized, preparing email");
        
        const emailResponse = await resend.emails.send({
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
                ${appleUrl ? `<p><a href="${appleUrl}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px 0;">Add to Apple Wallet</a></p>` : ''}
                ${passSource?.google ? `<p><a href="${passSource.google}" style="display: inline-block; background: #4285f4; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px 0;">Add to Google Wallet</a></p>` : ''}
              </div>

              <p style="color: #666; font-size: 14px;">
                Thank you for choosing TyrePlus. If you have any questions, please contact our support team.
              </p>
            </div>
          `,
        });
        
        console.log("[WALLET-PASS] Email sent successfully", { 
          emailId: emailResponse.data?.id,
          recipient: user.email 
        });
      } catch (emailError) {
        console.error("[WALLET-PASS] Email send failed (non-blocking):", {
          error: emailError instanceof Error ? emailError.message : String(emailError),
          recipient: user.email
        });
        // Don't throw - email is non-critical
      }
    } else {
      console.log("[WALLET-PASS] RESEND_API_KEY not configured, skipping email");
    }

    console.log("[WALLET-PASS] Returning success response");
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
