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
    console.log("[SIGNUP-BONUS] Function started");
    
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
    console.log("[SIGNUP-BONUS] User authenticated:", user.id);

    // Check if user already received signup bonus
    const { data: existingBonus } = await supabaseAdmin
      .from("loyalty_points")
      .select("id")
      .eq("user_id", user.id)
      .eq("transaction_type", "bonus")
      .eq("description", "Welcome Bonus")
      .single();

    if (existingBonus) {
      console.log("[SIGNUP-BONUS] Bonus already granted");
      return new Response(
        JSON.stringify({ success: false, message: "Bonus already granted" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Grant $20 sign-up bonus (2000 points)
    const { error: insertError } = await supabaseAdmin
      .from("loyalty_points")
      .insert({
        user_id: user.id,
        points: 2000,
        transaction_type: "bonus",
        description: "Welcome Bonus - $20 credit"
      });

    if (insertError) throw insertError;

    console.log("[SIGNUP-BONUS] Bonus granted successfully");
    
    return new Response(
      JSON.stringify({ success: true, points: 2000 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[SIGNUP-BONUS] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
