import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryEmailRequest {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  orderSummary?: string;
}

async function sendEmail(to: string[], subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Haus Technik <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, message, orderSummary }: InquiryEmailRequest = await req.json();

    console.log("Received inquiry from:", name, email);

    // Send notification email to store owner
    const notificationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">New Order Inquiry</h1>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Customer Details</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        
        ${message ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Message</h2>
          <p>${message}</p>
        </div>
        ` : ''}
        
        ${orderSummary ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Order Summary</h2>
          <pre style="white-space: pre-wrap; font-family: monospace;">${orderSummary}</pre>
        </div>
        ` : ''}
        
        <p style="color: #666; font-size: 12px; margin-top: 30px;">
          This inquiry was submitted from the Haus Technik website.
        </p>
      </div>
    `;

    const notificationEmail = await sendEmail(
      ["wai@haustechnik.co"],
      `New Order Inquiry from ${name}`,
      notificationHtml
    );

    console.log("Notification email sent:", notificationEmail);

    // Send confirmation email to customer
    const confirmationHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1a1a1a;">Thank you, ${name}!</h1>
        
        <p>We've received your order inquiry and will get back to you within 24 hours.</p>
        
        ${orderSummary ? `
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #333; margin-top: 0;">Your Items</h2>
          <pre style="white-space: pre-wrap; font-family: monospace;">${orderSummary}</pre>
        </div>
        ` : ''}
        
        <p>If you have any questions in the meantime, feel free to reply to this email.</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The Haus Technik Team</strong>
        </p>
      </div>
    `;

    const confirmationEmail = await sendEmail(
      [email],
      "We received your inquiry - Haus Technik",
      confirmationHtml
    );

    console.log("Confirmation email sent:", confirmationEmail);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-inquiry-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
