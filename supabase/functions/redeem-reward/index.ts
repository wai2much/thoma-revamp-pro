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

  try {
    console.log("[REDEEM-REWARD] Function started");
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) throw new Error("User not authenticated");
    console.log("[REDEEM-REWARD] User authenticated:", user.id);

    const { rewardId } = await req.json();
    if (!rewardId) throw new Error("Reward ID required");

    // Get reward details
    const { data: reward, error: rewardError } = await supabaseAdmin
      .from("loyalty_rewards")
      .select("*")
      .eq("id", rewardId)
      .eq("is_active", true)
      .single();

    if (rewardError || !reward) throw new Error("Reward not found or inactive");
    console.log("[REDEEM-REWARD] Reward found:", reward.title);

    // Get user's current balance
    const { data: balance, error: balanceError } = await supabaseAdmin
      .rpc("get_user_points_balance", { p_user_id: user.id });

    if (balanceError) throw balanceError;
    console.log("[REDEEM-REWARD] Current balance:", balance);

    if (balance < reward.points_required) {
      return new Response(
        JSON.stringify({ error: "Insufficient points" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Redeem reward
    const { error: redeemError } = await supabaseAdmin
      .from("loyalty_points")
      .insert({
        user_id: user.id,
        points: reward.points_required,
        transaction_type: "redeem",
        description: `Redeemed: ${reward.title}`
      });

    if (redeemError) throw redeemError;

    console.log("[REDEEM-REWARD] Reward redeemed successfully");
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        reward: reward.title,
        points_spent: reward.points_required,
        remaining_balance: balance - reward.points_required
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[REDEEM-REWARD] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
