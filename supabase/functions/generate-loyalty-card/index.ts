import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const loyaltyCardSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().regex(/^\+?[1-9]\d{6,14}$/, "Invalid phone number format").optional().or(z.literal("")),
});

// Generate a secure random member ID (alphanumeric, 12 chars)
function generateSecureMemberId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars like 0/O, 1/I/L
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

// Rate limiting: max 3 cards per IP per day
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 24;

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

    // Get client IP for rate limiting
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     "unknown";
    console.log("[LOYALTY-CARD] Client IP:", clientIp);

    // Check rate limit
    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - RATE_LIMIT_WINDOW_HOURS);
    
    const { count: recentCount } = await supabaseClient
      .from("loyalty_members")
      .select("*", { count: "exact", head: true })
      .eq("ip_address", clientIp)
      .gte("created_at", windowStart.toISOString());

    if (recentCount !== null && recentCount >= RATE_LIMIT_MAX) {
      console.log("[LOYALTY-CARD] Rate limit exceeded for IP:", clientIp);
      return new Response(
        JSON.stringify({ 
          error: "Rate limit exceeded. Maximum 3 loyalty cards per day. Please try again tomorrow." 
        }),
        { 
          headers: { ...corsHeaders, "Content-Type": "application/json" }, 
          status: 429 
        }
      );
    }

    const rawBody = await req.json();
    
    // Validate input
    const parseResult = loyaltyCardSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map(e => e.message).join(", ");
      console.error("[LOYALTY-CARD] Validation failed:", errorMessages);
      return new Response(JSON.stringify({ error: errorMessages }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }
    
    const { name, email, phone } = parseResult.data;

    console.log("[LOYALTY-CARD] Generating card for lead");

    // Check if email already has a card (prevent duplicates)
    const { data: existingByEmail } = await supabaseClient
      .from("loyalty_members")
      .select("member_id")
      .eq("email", email)
      .maybeSingle();

    if (existingByEmail) {
      console.log("[LOYALTY-CARD] Email already has a card");
      const origin = req.headers.get("origin") || "https://tyreplus.lovable.app";
      return new Response(
        JSON.stringify({ 
          success: true,
          message: "You already have a loyalty card!",
          cardUrl: `${origin}/loyalty-card/${existingByEmail.member_id}`,
          memberData: {
            memberId: existingByEmail.member_id,
          },
          isExisting: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Generate secure random member ID
    let memberId: string;
    let attempts = 0;
    do {
      memberId = generateSecureMemberId();
      const { data: existing } = await supabaseClient
        .from("loyalty_members")
        .select("id")
        .eq("member_id", memberId)
        .maybeSingle();
      if (!existing) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      throw new Error("Failed to generate unique member ID");
    }

    console.log("[LOYALTY-CARD] Generated secure member ID");
    
    // Member since as month name
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                       "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const memberSince = monthNames[new Date().getMonth()];

    // Store member data in loyalty_members table (proper PII storage)
    const { error: insertError } = await supabaseClient
      .from('loyalty_members')
      .insert({
        member_id: memberId,
        name: name,
        email: email,
        phone: phone || null,
        points_balance: 20, // $20 welcome credit
        ip_address: clientIp,
      });

    if (insertError) {
      console.error("[LOYALTY-CARD] Error storing member data:", insertError);
      throw new Error(`Failed to store member data: ${insertError.message}`);
    }

    console.log("[LOYALTY-CARD] Member data stored successfully");

    // Generate card URL
    const origin = req.headers.get("origin") || "https://tyreplus.lovable.app";
    const cardUrl = `${origin}/loyalty-card/${memberId}`;

    // Send SMS if phone number provided
    if (phone) {
      console.log("[LOYALTY-CARD] Sending SMS");
      
      const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
      
      if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
        try {
          const smsBody = `Hi ${name}! 🎉 Welcome to TyrePlus Loyalty!\n\nYour $20 welcome credit is ready!\nMember ID: ${memberId}\n\nView your card: ${cardUrl}\n\nBookmark this link for easy access!`;
          
          const twilioResponse = await fetch(
            `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`,
            {
              method: "POST",
              headers: {
                "Authorization": `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: new URLSearchParams({
                To: phone,
                From: twilioPhoneNumber,
                Body: smsBody,
              }),
            }
          );

          if (twilioResponse.ok) {
            console.log("[LOYALTY-CARD] SMS sent successfully");
          } else {
            const errorText = await twilioResponse.text();
            console.error("[LOYALTY-CARD] SMS send failed:", errorText);
          }
        } catch (smsError) {
          console.error("[LOYALTY-CARD] SMS error:", smsError);
        }
      } else {
        console.log("[LOYALTY-CARD] Twilio not configured, skipping SMS");
      }
    }

    return new Response(JSON.stringify({
      success: true,
      cardUrl: cardUrl,
      memberData: {
        memberName: name,
        memberEmail: email,
        memberPhone: phone,
        memberId,
        memberSince,
        credit: "$20.00",
        points: 20
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
