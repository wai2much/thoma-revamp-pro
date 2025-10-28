import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-passentry-signature",
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
    console.log("[PASSENTRY-WEBHOOK] Received webhook request");

    // Verify webhook signature
    const signature = req.headers.get("x-passentry-signature");
    const webhookSecret = Deno.env.get("PASSENTRY_WEBHOOK_SECRET");
    
    if (!webhookSecret) {
      console.error("[PASSENTRY-WEBHOOK] Webhook secret not configured");
      throw new Error("Webhook secret not configured");
    }

    const rawBody = await req.text();
    
    if (signature) {
      // Verify webhook signature using Web Crypto API
      const encoder = new TextEncoder();
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(webhookSecret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
      );
      
      const signatureBytes = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(rawBody)
      );
      
      const expectedSignature = Array.from(new Uint8Array(signatureBytes))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== expectedSignature) {
        console.error("[PASSENTRY-WEBHOOK] Invalid signature");
        throw new Error("Invalid webhook signature");
      }
      console.log("[PASSENTRY-WEBHOOK] Signature verified");
    }

    const payload = JSON.parse(rawBody);
    console.log("[PASSENTRY-WEBHOOK] Event type:", payload.event);

    // Handle pass.created event
    if (payload.event === "pass.created") {
      const passData = payload.data;
      const metadata = passData.metadata || {};
      
      console.log("[PASSENTRY-WEBHOOK] Pass created:", {
        passId: passData.id,
        externalId: passData.externalId,
        metadata
      });

      // Extract data from webhook payload
      const userId = metadata.user_id;
      const subscriptionId = metadata.subscription_id;
      const productId = metadata.product_id;
      const memberId = passData.externalId; // This is our member ID
      
      if (!userId || !subscriptionId) {
        console.error("[PASSENTRY-WEBHOOK] Missing required metadata:", { userId, subscriptionId });
        throw new Error("Missing user_id or subscription_id in metadata");
      }

      // Check if pass already exists
      const { data: existingPass } = await supabaseClient
        .from("membership_passes")
        .select("id")
        .eq("subscription_id", subscriptionId)
        .single();

      if (existingPass) {
        console.log("[PASSENTRY-WEBHOOK] Pass already exists for subscription:", subscriptionId);
        return new Response(JSON.stringify({ success: true, message: "Pass already recorded" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      }

      // Insert pass record into database
      const { error: insertError } = await supabaseClient
        .from("membership_passes")
        .insert({
          user_id: userId,
          member_id: memberId,
          pass_id: passData.id,
          apple_url: passData.passSource?.apple || passData.downloadUrl,
          google_url: passData.passSource?.google,
          download_url: passData.downloadUrl,
          subscription_id: subscriptionId,
          product_id: productId,
        });

      if (insertError) {
        console.error("[PASSENTRY-WEBHOOK] Error inserting pass:", insertError);
        throw insertError;
      }

      console.log("[PASSENTRY-WEBHOOK] Pass record created successfully");
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Handle pass.updated event
    if (payload.event === "pass.updated") {
      const passData = payload.data;
      console.log("[PASSENTRY-WEBHOOK] Pass updated:", passData.id);

      // Update pass URLs if they changed
      const { error: updateError } = await supabaseClient
        .from("membership_passes")
        .update({
          apple_url: passData.passSource?.apple || passData.downloadUrl,
          google_url: passData.passSource?.google,
          download_url: passData.downloadUrl,
        })
        .eq("pass_id", passData.id);

      if (updateError) {
        console.error("[PASSENTRY-WEBHOOK] Error updating pass:", updateError);
        throw updateError;
      }

      console.log("[PASSENTRY-WEBHOOK] Pass updated successfully");
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Unknown event type
    console.log("[PASSENTRY-WEBHOOK] Unknown event type, ignoring");
    return new Response(JSON.stringify({ success: true, message: "Event ignored" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[PASSENTRY-WEBHOOK] ERROR:", errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
