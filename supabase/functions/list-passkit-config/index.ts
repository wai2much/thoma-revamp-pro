import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PASSKIT_API_BASE = "https://api.pub1.passkit.io";

function base64url(data: Uint8Array): string {
  return btoa(String.fromCharCode(...data))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function generatePassKitJWT(apiKey: string, apiSecret: string): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { uid: apiKey, exp: now + 300, iat: now };

  const encoder = new TextEncoder();
  const headerB64 = base64url(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64url(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  return `${signingInput}.${base64url(new Uint8Array(signature))}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("PASSKIT_API_KEY");
    const apiSecret = Deno.env.get("PASSKIT_API_SECRET");
    if (!apiKey || !apiSecret) throw new Error("PassKit credentials not configured");

    const jwt = await generatePassKitJWT(apiKey, apiSecret);
    console.log("[LIST-PASSKIT] JWT generated, fetching programs...");

    // List programs
    const programsRes = await fetch(`${PASSKIT_API_BASE}/members/programs`, {
      method: "GET",
      headers: { "Authorization": `Bearer ${jwt}` },
    });
    
    let programs: any = null;
    let programsError: string | null = null;
    if (programsRes.ok) {
      programs = await programsRes.json();
    } else {
      programsError = await programsRes.text();
      console.log("[LIST-PASSKIT] Programs GET failed, trying POST /list...");
      
      // Try POST method
      const programsRes2 = await fetch(`${PASSKIT_API_BASE}/members/programs/list`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${jwt}`, "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (programsRes2.ok) {
        programs = await programsRes2.json();
        programsError = null;
      } else {
        programsError = await programsRes2.text();
      }
    }

    console.log("[LIST-PASSKIT] Programs result:", JSON.stringify(programs || programsError));

    // Try listing tiers for known program ID
    let tiers: any = null;
    let tiersError: string | null = null;
    
    const programId = "090GL9tNop4009zPvkhvyV";
    
    const tiersRes = await fetch(`${PASSKIT_API_BASE}/members/tiers/list`, {
      method: "POST",
      headers: { "Authorization": `Bearer ${jwt}`, "Content-Type": "application/json" },
      body: JSON.stringify({ programId }),
    });
    
    if (tiersRes.ok) {
      tiers = await tiersRes.json();
    } else {
      tiersError = await tiersRes.text();
      console.log("[LIST-PASSKIT] Tiers error:", tiersError);
    }

    return new Response(JSON.stringify({
      programs: programs || programsError,
      tiers: tiers || tiersError,
      programIdUsed: programId,
    }, null, 2), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[LIST-PASSKIT] Error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
