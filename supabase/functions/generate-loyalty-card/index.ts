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
  phone: z.string().max(20).optional().or(z.literal("")),
});

// Generate a secure random member ID (alphanumeric, 12 chars)
function generateSecureMemberId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const array = new Uint8Array(12);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
}

// Rate limiting: max 3 cards per IP per day
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 24;

// Loyalty card template ID
const LOYALTY_PRODUCT_ID = "loyalty_card";

// Car banner images for random selection
const CAR_BANNERS = [
  "banner-speed-branded.png",
  "banner-city-sunset-branded.png",
  "banner-racing-sunset-branded.png"
];

// Fetch template ID from database
async function getTemplateId(supabaseClient: any): Promise<string | null> {
  const { data, error } = await supabaseClient
    .from('passentry_config')
    .select('template_id')
    .eq('product_id', LOYALTY_PRODUCT_ID)
    .single();

  if (error) {
    console.error('[LOYALTY-CARD] Error fetching template:', error);
    return null;
  }

  return data?.template_id || null;
}

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
      .select("*")
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
            memberName: existingByEmail.name,
            points: existingByEmail.points_balance,
          },
          passUrls: {
            appleUrl: existingByEmail.apple_url,
            googleUrl: existingByEmail.google_url,
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

    console.log("[LOYALTY-CARD] Generated secure member ID:", memberId);
    
    // Member since as month name
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                       "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const memberSince = monthNames[new Date().getMonth()];

    // Generate PassEntry wallet pass
    let appleUrl = null;
    let googleUrl = null;
    let passId = null;

    const passEntryKey = Deno.env.get("PASSENTRY_API_KEY");
    if (passEntryKey) {
      try {
        const templateId = await getTemplateId(supabaseClient);
        if (templateId) {
          // Randomly select a car banner
          const randomBanner = CAR_BANNERS[Math.floor(Math.random() * CAR_BANNERS.length)];
          const origin = req.headers.get("origin") || "https://tyreplus.lovable.app";
          const bannerUrl = `${origin}/assets/${randomBanner}`;
          
          console.log("[LOYALTY-CARD] Creating PassEntry wallet pass with template:", templateId);

          // Use the actual template field names from the loyalty_card template
          const passEntryResponse = await fetch(`https://api.passentry.com/api/v1/passes?passTemplate=${templateId}&includePassSource=apple,google`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${passEntryKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              externalId: memberId,
              pass: {
                First_Last: name.toUpperCase(),
                ID: memberId,
                Custom: memberSince,
                Monthly_Yearly: "LOYALTY"
              },
            }),
          });

          if (passEntryResponse.ok) {
            const passData = await passEntryResponse.json();
            console.log("[LOYALTY-CARD] PassEntry pass created:", passData.data?.id);
            
            passId = passData.data?.id;
            const passSource = passData.data?.attributes?.passSource;
            appleUrl = passSource?.apple || passData.data?.attributes?.downloadUrl;
            googleUrl = passSource?.google;
          } else {
            const errorText = await passEntryResponse.text();
            console.error("[LOYALTY-CARD] PassEntry API error:", errorText);
          }
        } else {
          console.log("[LOYALTY-CARD] No template configured for loyalty cards");
        }
      } catch (passError) {
        console.error("[LOYALTY-CARD] PassEntry error (non-fatal):", passError);
      }
    } else {
      console.log("[LOYALTY-CARD] PASSENTRY_API_KEY not configured");
    }

    // Store member data in loyalty_members table
    const { error: insertError } = await supabaseClient
      .from('loyalty_members')
      .insert({
        member_id: memberId,
        name: name,
        email: email,
        phone: phone || null,
        points_balance: 20,
        ip_address: clientIp,
        apple_url: appleUrl,
        google_url: googleUrl,
        pass_id: passId,
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
      },
      passUrls: {
        appleUrl,
        googleUrl,
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
