import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const LOYALTY_PREFIX = "635BF"; // Stripe purple #635BFF
const LOYALTY_PRODUCT_ID = "loyalty_card"; // Special identifier for loyalty card template

// Car banner images for random selection (1125px x 432px) - branded with Business Velocity Pack
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

    const { name, email, phone } = await req.json();
    
    if (!name || !email) {
      throw new Error("Name and email are required");
    }

    console.log("[LOYALTY-CARD] Generating card for lead", { email, name });

    // Generate unique member ID (simple numeric for loyalty card)
    const memberId = Math.floor(1000 + Math.random() * 9000).toString();
    console.log("[LOYALTY-CARD] Generated member ID:", memberId);
    
    // Member since as month name
    const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
                       "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];
    const memberSince = monthNames[new Date().getMonth()];

    // Store member data in loyalty_points table
      const { error: insertError } = await supabaseClient
      .from('loyalty_points')
      .insert({
        user_id: '00000000-0000-0000-0000-000000000000', // Anonymous user for leads
        points: 20, // $20 welcome credit = 20 points (1 point = $1)
        description: `${name} - ${email} - ${phone || 'No phone'}`,
        transaction_type: 'bonus',
        order_id: `MEMBER-${memberId}` // Store member ID in order_id for easy lookup
      });

    if (insertError) {
      console.error("[LOYALTY-CARD] Error storing member data:", insertError);
      throw new Error(`Failed to store member data: ${insertError.message}`);
    }

    console.log("[LOYALTY-CARD] Member data stored successfully");

    // Generate card URL
    const origin = req.headers.get("origin") || "https://64a7bebe-dd72-4b4c-ba13-a98f02a39d2a.lovableproject.com";
    const cardUrl = `${origin}/loyalty-card/${memberId}`;

    // Send SMS if phone number provided
    if (phone) {
      console.log("[LOYALTY-CARD] Sending SMS to:", phone);
      
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
          // Don't fail the whole request if SMS fails
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