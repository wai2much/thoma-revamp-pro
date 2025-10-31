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
    console.log('Twilio webhook called');
    
    // Parse incoming form data from Twilio
    const formData = await req.formData();
    const from = formData.get('From');
    const to = formData.get('To');
    const callSid = formData.get('CallSid');
    
    console.log('Call received:', { from, to, callSid });

    // Generate TwiML response for incoming call
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf" numDigits="1" action="https://lnfmxpcpudugultrpwwa.supabase.co/functions/v1/twilio-webhook/menu" method="POST">
    <Say voice="alice">Welcome to Tyre Plus Membership Program.</Say>
    <Say voice="alice">Press 1 to check your membership status.</Say>
    <Say voice="alice">Press 2 to speak with our A I assistant about your membership benefits.</Say>
    <Say voice="alice">Press 0 to speak with a representative.</Say>
  </Gather>
  <Say voice="alice">We didn't receive any input. Goodbye!</Say>
  <Hangup/>
</Response>`;

    return new Response(twiml, {
      headers: {
        'Content-Type': 'text/xml',
        ...corsHeaders,
      },
    });

  } catch (error) {
    console.error('Error in Twilio webhook:', error);
    
    // Return a safe TwiML response even on error
    const errorTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">We're experiencing technical difficulties. Please try again later.</Say>
  <Hangup/>
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
