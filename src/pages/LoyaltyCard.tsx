import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LoyaltyCard() {
  const { memberId } = useParams();
  const [error, setError] = useState<string | null>(null);
  const [fallbackUrls, setFallbackUrls] = useState<{ appleUrl?: string; googleUrl?: string } | null>(null);

  useEffect(() => {
    const fetchAndRedirect = async () => {
      if (!memberId) {
        setError("No member ID provided");
        return;
      }

      // Validate member ID format (alphanumeric, 12 chars)
      if (!/^[A-Z0-9]{12}$/i.test(memberId)) {
        setError("Invalid member ID format");
        return;
      }

      try {
        const { data, error: dbError } = await supabase
          .from("loyalty_members")
          .select("apple_url, google_url")
          .eq("member_id", memberId)
          .maybeSingle();

        if (dbError) throw dbError;

        if (!data) {
          setError("Card not found");
          return;
        }

        // Detect device and redirect
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const isAndroid = /Android/i.test(navigator.userAgent);

        if (isIOS && data.apple_url) {
          window.location.href = data.apple_url;
        } else if (isAndroid && data.google_url) {
          window.location.href = data.google_url;
        } else if (data.apple_url) {
          // Default to Apple if available
          window.location.href = data.apple_url;
        } else if (data.google_url) {
          window.location.href = data.google_url;
        } else {
          // No wallet URLs yet - show fallback
          setFallbackUrls({ appleUrl: data.apple_url, googleUrl: data.google_url });
        }
      } catch (err) {
        console.error("Error fetching member:", err);
        setError("Failed to load card");
      }
    };

    fetchAndRedirect();
  }, [memberId]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-4">
        <Card className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
          <p className="text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  if (fallbackUrls) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-4">
        <Card className="glass-card p-8 text-center space-y-4">
          <h1 className="text-2xl font-bold">Your Wallet Pass</h1>
          <p className="text-muted-foreground">Choose your wallet:</p>
          <div className="flex flex-col gap-3">
            {fallbackUrls.appleUrl && (
              <Button asChild size="lg" className="bg-black hover:bg-black/90 text-white">
                <a href={fallbackUrls.appleUrl}>Add to Apple Wallet</a>
              </Button>
            )}
            {fallbackUrls.googleUrl && (
              <Button asChild size="lg" className="bg-[#4285f4] hover:bg-[#4285f4]/90 text-white">
                <a href={fallbackUrls.googleUrl}>Add to Google Wallet</a>
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
        <p className="text-muted-foreground">Redirecting to your wallet pass...</p>
      </div>
    </div>
  );
}
