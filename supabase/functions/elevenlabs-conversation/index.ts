import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('ElevenLabs conversation webhook called');
    
    const formData = await req.formData();
    const callSid = formData.get('CallSid');
    
    console.log('Starting ElevenLabs conversation for call:', callSid);

    const elevenLabsApiKey = Deno.env.get('ELEVENLABS_API_KEY');
    if (!elevenLabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Get signed URL from ElevenLabs for conversational AI
    const agentResponse = await fetch(
      'https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=YOUR_AGENT_ID',
      {
        method: 'GET',
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      }
    );

    if (!agentResponse.ok) {
      console.error('Failed to get ElevenLabs signed URL');
      throw new Error('Failed to initialize conversation');
    }

    const { signed_url } = await agentResponse.json();

    // Generate TwiML to connect call to ElevenLabs
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting you to our A I assistant. Please wait.</Say>
  <Connect>
    <Stream url="${signed_url.replace('https://', 'wss://')}" />
  </Connect>
</Response>`;

    return new Response(twiml, {
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in ElevenLabs conversation:', error);
    
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Sorry, our A I assistant is currently unavailable. Please try again later or press 0 to speak with a representative.</Say>
  <Redirect>https://lnfmxpcpudugultrpwwa.supabase.co/functions/v1/twilio-webhook</Redirect>
</Response>`;

    return new Response(errorTwiml, {
      status: 200,
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders,
      },
    });
  }
});
