import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate Twilio signature to prevent spoofing
function validateTwilioSignature(
  signature: string | null,
  url: string,
  params: Record<string, string>,
  authToken: string
): boolean {
  if (!signature) return false;

  // Sort parameters and concatenate with URL
  const data = url + Object.keys(params)
    .sort()
    .map(key => `${key}${params[key]}`)
    .join('');

  // Compute HMAC-SHA1
  const hmac = createHmac('sha1', authToken);
  hmac.update(data);
  const computedSignature = hmac.digest('base64');

  return computedSignature === signature;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const action = pathSegments[pathSegments.length - 1];
    
    console.log('Twilio webhook called, action:', action);
    
    // Parse incoming form data from Twilio
    const formData = await req.formData();
    const from = formData.get('From');
    const to = formData.get('To');
    const callSid = formData.get('CallSid');
    const digits = formData.get('Digits');
    const messageBody = formData.get('Body'); // SMS message body
    const messageSid = formData.get('MessageSid'); // SMS identifier
    
    console.log('Request data:', { from, to, callSid, messageSid, messageBody, digits, action });

    // Validate Twilio signature for security
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    if (authToken) {
      const twilioSignature = req.headers.get('X-Twilio-Signature');
      const fullUrl = url.protocol + '//' + url.host + url.pathname;
      
      // Convert formData to params object for validation
      const params: Record<string, string> = {};
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
      
      const isValid = validateTwilioSignature(twilioSignature, fullUrl, params, authToken);
      
      if (!isValid) {
        console.error('Invalid Twilio signature - possible spoofing attempt');
        return new Response('Forbidden', { 
          status: 403,
          headers: corsHeaders 
        });
      }
      
      console.log('Twilio signature validated successfully');
    } else {
      console.warn('TWILIO_AUTH_TOKEN not configured - skipping signature validation');
    }

    // Handle SMS messages
    if (messageBody && messageSid) {
      console.log('Processing SMS message:', { from, messageBody });
      
      // Respond to SMS
      const smsTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thank you for contacting Tyre Plus! For membership inquiries, please call ${to} or visit our website. Our AI assistant is ready to help you with your membership benefits.</Message>
</Response>`;
      
      return new Response(smsTwiml, {
        headers: { 'Content-Type': 'text/xml', ...corsHeaders },
      });
    }

    // Handle menu selection
    if (action === 'menu' && digits) {
      console.log('Processing menu selection:', digits);
      
      switch (digits) {
        case '1':
          // Check membership status
          const statusTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">To check your membership status, please visit our website or contact us via email.</Say>
  <Say voice="alice">Thank you for calling. Goodbye!</Say>
  <Hangup/>
</Response>`;
          return new Response(statusTwiml, {
            headers: { 'Content-Type': 'text/xml', ...corsHeaders },
          });
          
        case '2':
          // Connect to ElevenLabs AI assistant
          const aiTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Redirect>https://lnfmxpcpudugultrpwwa.supabase.co/functions/v1/elevenlabs-conversation</Redirect>
</Response>`;
          return new Response(aiTwiml, {
            headers: { 'Content-Type': 'text/xml', ...corsHeaders },
          });
          
        case '0':
          // Connect to representative
          const repTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Connecting you to a representative. Please hold.</Say>
  <Dial>+1234567890</Dial>
</Response>`;
          return new Response(repTwiml, {
            headers: { 'Content-Type': 'text/xml', ...corsHeaders },
          });
          
        default:
          // Invalid selection
          const invalidTwiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Invalid selection.</Say>
  <Redirect>https://lnfmxpcpudugultrpwwa.supabase.co/functions/v1/twilio-webhook</Redirect>
</Response>`;
          return new Response(invalidTwiml, {
            headers: { 'Content-Type': 'text/xml', ...corsHeaders },
          });
      }
    }

    // Initial greeting menu
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Gather input="dtmf" numDigits="1" action="https://lnfmxpcpudugultrpwwa.supabase.co/functions/v1/twilio-webhook/menu" method="POST" timeout="5">
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
