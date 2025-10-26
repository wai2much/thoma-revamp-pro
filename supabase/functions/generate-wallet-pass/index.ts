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

const PASSENTRY_TEMPLATE = "c1effedba2763ae003f66888";

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

    // Create PassEntry wallet pass with all field mappings
    const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${PASSENTRY_TEMPLATE}&includePassSource=apple,google`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${passEntryKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: memberId,
        pass: {
          balanceLabel: { value: "LOYALTY POINTS" },
          centralLabel: { value: planName },
          label1: { value: memberId },
          label2: { value: memberName },
          label3: { value: memberSince },
          label4: { value: validUntil },
          barcode: {
            enabled: true,
            type: "qr",
            source: "custom",
            value: `TYREPLUS-${memberId}`,
            displayText: true
          }
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
