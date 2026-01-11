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
    console.log("[AWARD-CHECKIN] Function started");
    
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Validate authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }
    
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("User not authenticated");
    }
    console.log("[AWARD-CHECKIN] Caller authenticated:", user.id);

    // CRITICAL: Check if the caller has operator or admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["operator", "admin"])
      .maybeSingle();

    if (roleError) {
      console.error("[AWARD-CHECKIN] Role check error:", roleError);
      throw new Error("Failed to verify permissions");
    }

    if (!roleData) {
      console.log("[AWARD-CHECKIN] Unauthorized - user lacks operator/admin role");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Only operators and admins can award points" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }
    
    console.log("[AWARD-CHECKIN] Role verified:", roleData.role);

    // Parse and validate request body
    const { userId, points, description } = await req.json();
    
    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid userId: must be a non-empty string");
    }
    
    if (!points || typeof points !== "number" || points <= 0 || points > 1000) {
      throw new Error("Invalid points: must be a number between 1 and 1000");
    }
    
    const sanitizedDescription = description 
      ? String(description).slice(0, 200) 
      : "Check-in bonus";

    console.log(`[AWARD-CHECKIN] Awarding ${points} points to user ${userId}`);

    // Award the points
    const { error: insertError } = await supabaseAdmin
      .from("loyalty_points")
      .insert({
        user_id: userId,
        points: points,
        transaction_type: "earn",
        description: sanitizedDescription
      });

    if (insertError) {
      console.error("[AWARD-CHECKIN] Insert error:", insertError);
      throw new Error("Failed to award points");
    }

    console.log("[AWARD-CHECKIN] Points awarded successfully");
    
    return new Response(
      JSON.stringify({ success: true, points }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("[AWARD-CHECKIN] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
