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

    console.log("[LIST-PASSKIT] API Key prefix:", apiKey.substring(0, 8) + "...");
    const jwt = await generatePassKitJWT(apiKey, apiSecret);
    console.log("[LIST-PASSKIT] JWT generated, listing programs via POST...");

    // List programs - POST method per docs
    const programsRes = await fetch(`${PASSKIT_API_BASE}/members/programs/`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: 100, offset: 0 }),
    });

    let programs: any = null;
    let programsError: string | null = null;
    const programsBody = await programsRes.text();
    console.log("[LIST-PASSKIT] Programs response:", programsRes.status, programsBody);

    if (programsRes.ok) {
      try { programs = JSON.parse(programsBody); } catch { programs = programsBody; }
    } else {
      programsError = `${programsRes.status}: ${programsBody}`;
    }

    // List tiers via POST
    let tiers: any = null;
    let tiersError: string | null = null;

    const tiersRes = await fetch(`${PASSKIT_API_BASE}/members/tiers/list`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ limit: 100, offset: 0 }),
    });

    const tiersBody = await tiersRes.text();
    console.log("[LIST-PASSKIT] Tiers response:", tiersRes.status, tiersBody);

    if (tiersRes.ok) {
      try { tiers = JSON.parse(tiersBody); } catch { tiers = tiersBody; }
    } else {
      tiersError = `${tiersRes.status}: ${tiersBody}`;
    }

    return new Response(JSON.stringify({
      programs: programs ?? programsError,
      tiers: tiers ?? tiersError,
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
