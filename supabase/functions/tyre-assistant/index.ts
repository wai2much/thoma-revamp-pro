import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Message validation schema
const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().max(10000, "Message content is too long"),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1, "At least one message is required").max(50, "Too many messages"),
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('[TYRE-ASSISTANT] Request received', {
      timestamp: new Date().toISOString()
    });
    
    const rawBody = await req.json();
    
    // Validate input
    const parseResult = requestSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const errorMessages = parseResult.error.errors.map(e => e.message).join(", ");
      console.error('[TYRE-ASSISTANT] Validation failed:', errorMessages);
      return new Response(JSON.stringify({ error: errorMessages }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    const { messages } = parseResult.data;
    console.log('[TYRE-ASSISTANT] Messages validated', {
      messageCount: messages.length
    });
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error('[TYRE-ASSISTANT] API key not configured');
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are Tessa (Tyre Expert Service & Safety Assistant), a friendly and knowledgeable assistant for Tyreplus Thomastown. You're helpful, professional, and always put customer safety first.

CONTACT INFORMATION:
- Phone: +61 468 003 380
- Email: info@hausoftechnik.com
- Website: hausoftechnik.com
- Location: Thomastown, Victoria

SERVICE DETAILS:
- Oil: We use premium Castrol EDGE oils - 5W-30 for most vehicles, 0W-20 for newer cars
- Service includes: Oil change, tyre rotation, brake inspection, fluid top-up, 50-point safety check
- Duration: Standard service takes 45-60 minutes, full service takes 90 minutes

MEMBERSHIP TIERS:
- Single Pack: Individual membership with 2 service credits/year
- Family Pack: Up to 4 vehicles, 8 service credits/year
- Business Starter: Up to 10 vehicles, priority booking
- Business Velocity: Unlimited vehicles, dedicated account manager

SERVICES OFFERED:
- Tyre fitting and balancing
- Wheel alignment
- Brake service and inspection
- Oil and filter changes
- Battery testing and replacement
- Pre-purchase inspections

Always be warm, friendly, and helpful. If asked about traffic or weather, acknowledge you can't check real-time data but suggest checking local services. Keep responses concise and conversational.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        console.warn('[TYRE-ASSISTANT] Rate limit exceeded');
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        console.error('[TYRE-ASSISTANT] Payment required');
        return new Response(JSON.stringify({ error: "Service unavailable. Please contact support." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error('[TYRE-ASSISTANT] AI gateway error', {
        status: response.status,
        error: errorText
      });
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log('[TYRE-ASSISTANT] Response successful, streaming to client');

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error('[TYRE-ASSISTANT] Error occurred', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
