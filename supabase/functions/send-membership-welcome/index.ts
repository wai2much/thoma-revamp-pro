import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PRODUCT_NAMES: Record<string, string> = {
  "prod_TIKlo107LUfRkP": "Single Pack",
  "prod_TIKmAWTileFjnm": "Family Pack",
  "prod_TIKmxYafsqTXwO": "Business Starter Pack",
  "prod_TIKmurHwJ5bDWJ": "Business Velocity Pack",
};

interface WelcomeRequest {
  name: string;
  email: string;
  phone?: string;
  memberId: string;
  planName: string;
  productId: string;
  appleWalletUrl?: string;
  googlePayUrl?: string;
  passUrl?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("[MEMBERSHIP-WELCOME] Function started");

    const { 
      name, 
      email, 
      phone, 
      memberId, 
      planName, 
      productId,
      appleWalletUrl,
      googlePayUrl,
      passUrl
    }: WelcomeRequest = await req.json();

    if (!name || !email || !memberId || !planName) {
      throw new Error("Missing required fields: name, email, memberId, planName");
    }

    console.log("[MEMBERSHIP-WELCOME] Sending welcome for member:", { email, memberId, planName });

    // Initialize Resend
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

    // Prepare wallet pass buttons HTML
    let walletButtonsHtml = '';
    if (appleWalletUrl || googlePayUrl || passUrl) {
      walletButtonsHtml = `
        <div style="margin: 30px 0; text-align: center;">
          <h3 style="color: #333; font-size: 16px; margin-bottom: 15px;">Add to Your Digital Wallet</h3>
          <div style="display: flex; flex-direction: column; gap: 10px; align-items: center;">
            ${appleWalletUrl ? `
              <a href="${appleWalletUrl}" style="display: inline-block; padding: 12px 24px; background: #000; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📱 Add to Apple Wallet
              </a>
            ` : ''}
            ${googlePayUrl ? `
              <a href="${googlePayUrl}" style="display: inline-block; padding: 12px 24px; background: #4285F4; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📱 Add to Google Pay
              </a>
            ` : ''}
            ${passUrl && !appleWalletUrl && !googlePayUrl ? `
              <a href="${passUrl}" style="display: inline-block; padding: 12px 24px; background: #635BFF; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">
                📱 Download Pass
              </a>
            ` : ''}
          </div>
        </div>
      `;
    }

    // Send welcome email
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to TyrePlus Membership</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Welcome to TyrePlus!</h1>
          </div>
          
          <div style="background: #fff; padding: 30px 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Congratulations! Your <strong>${planName}</strong> membership is now active. 🚗✨
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h2 style="color: #635BFF; margin: 0 0 15px 0; font-size: 18px;">Your Membership Details</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Member ID:</td>
                  <td style="padding: 8px 0; font-weight: 600; text-align: right; font-family: monospace;">${memberId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Plan:</td>
                  <td style="padding: 8px 0; font-weight: 600; text-align: right;">${planName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Member Since:</td>
                  <td style="padding: 8px 0; font-weight: 600; text-align: right;">${new Date().getFullYear()}</td>
                </tr>
              </table>
            </div>

            ${walletButtonsHtml}
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333; font-size: 16px; margin-bottom: 10px;">What's Next?</h3>
              <ul style="color: #6b7280; padding-left: 20px;">
                <li style="margin-bottom: 8px;">Add your membership card to your digital wallet for easy access</li>
                <li style="margin-bottom: 8px;">Visit your dashboard to view membership benefits</li>
                <li style="margin-bottom: 8px;">Book your first service and start saving!</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="https://hausoftechnik.com/membership" style="display: inline-block; padding: 12px 32px; background: #635BFF; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                View My Dashboard
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              Questions? Reply to this email or contact us at <a href="mailto:waiwu1975@gmail.com" style="color: #635BFF;">waiwu1975@gmail.com</a>
            </p>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p>TyrePlus Thomastown | Membership Services</p>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await resend.emails.send({
      from: "TyrePlus Membership <onboarding@resend.dev>",
      replyTo: "waiwu1975@gmail.com",
      to: [email],
      subject: `🎉 Welcome to TyrePlus ${planName}!`,
      html: emailHtml,
    });

    console.log("[MEMBERSHIP-WELCOME] Email sent:", emailResponse);

    // Send SMS if phone number provided
    let smsStatus = "not_attempted";
    if (phone) {
      console.log("[MEMBERSHIP-WELCOME] Sending SMS to:", phone);
      
      const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
      const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");
      const twilioPhoneNumber = Deno.env.get("TWILIO_PHONE_NUMBER");
      
      if (twilioAccountSid && twilioAuthToken && twilioPhoneNumber) {
        try {
          const cardUrl = `https://hausoftechnik.com/membership`;
          const smsBody = `Hi ${name}! 🎉 Welcome to TyrePlus ${planName}!\n\nMember ID: ${memberId}\n\nView your dashboard: ${cardUrl}\n\nYour digital membership card has been sent to your email!`;
          
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
            console.log("[MEMBERSHIP-WELCOME] SMS sent successfully");
            smsStatus = "sent";
          } else {
            const errorText = await twilioResponse.text();
            console.error("[MEMBERSHIP-WELCOME] SMS send failed:", errorText);
            smsStatus = "failed";
          }
        } catch (smsError) {
          console.error("[MEMBERSHIP-WELCOME] SMS error:", smsError);
          smsStatus = "error";
        }
      } else {
        console.log("[MEMBERSHIP-WELCOME] Twilio not configured, skipping SMS");
        smsStatus = "not_configured";
      }
    }

    return new Response(JSON.stringify({
      success: true,
      emailSent: true,
      smsSent: smsStatus === "sent",
      smsStatus,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[MEMBERSHIP-WELCOME] ERROR:", errorMessage);
    return new Response(JSON.stringify({ 
      error: errorMessage,
      success: false 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
