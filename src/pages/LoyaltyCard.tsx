import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "qrcode";
import { Loader2, Smartphone } from "lucide-react";

interface MemberData {
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberId: string;
  memberSince: string;
  credit: string;
  points: number;
  appleUrl?: string;
  googleUrl?: string;
}

export default function LoyaltyCard() {
  const { memberId } = useParams();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!memberId) return;

      // Validate member ID format (alphanumeric, 12 chars)
      if (!/^[A-Z0-9]{12}$/i.test(memberId)) {
        console.error("Invalid member ID format");
        setLoading(false);
        return;
      }

      try {
        // Fetch member data from loyalty_members table
        const { data, error } = await supabase
          .from("loyalty_members")
          .select("*")
          .eq("member_id", memberId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          const parsedData: MemberData = {
            memberName: data.name || "Member",
            memberEmail: data.email || "",
            memberPhone: data.phone || "",
            memberId: data.member_id,
            memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            credit: `$${(data.points_balance || 0).toFixed(2)}`,
            points: data.points_balance || 0,
            appleUrl: data.apple_url,
            googleUrl: data.google_url,
          };

          setMemberData(parsedData);

          // Generate QR code
          const qrData = `HAUS-LOYALTY-${memberId}`;
          const qrUrl = await QRCode.toDataURL(qrData, {
            width: 200,
            margin: 2,
            color: {
              dark: "#000000",
              light: "#FFFFFF",
            },
          });
          setQrCodeUrl(qrUrl);
        }
      } catch (error) {
        console.error("Error fetching member data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!memberData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background p-4">
        <Card className="glass-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Card Not Found</h1>
          <p className="text-muted-foreground">This loyalty card doesn't exist.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-4">
      <div className="max-w-md mx-auto pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Haus of Technik Loyalty Card</h1>
          <p className="text-muted-foreground">Your digital membership card</p>
        </div>

        <Card className="glass-card overflow-hidden">
          {/* Banner */}
          <div className="h-32 bg-gradient-to-r from-primary via-primary-glow to-accent relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.8),rgba(255,255,255,0))]" />
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-6">
            {/* Member Info */}
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground mb-1">MEMBER NAME</div>
                <div className="text-xl font-bold">{memberData.memberName}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">MEMBER ID</div>
                  <div className="text-lg font-semibold">{memberData.memberId}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">MEMBER SINCE</div>
                  <div className="text-lg font-semibold">{memberData.memberSince}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">WELCOME CREDIT</div>
                <div className="text-2xl font-bold text-primary">{memberData.credit}</div>
              </div>

              <div>
                <div className="text-xs text-muted-foreground mb-1">LOYALTY POINTS</div>
                <div className="text-2xl font-bold text-accent">{memberData.points} pts</div>
              </div>
            </div>

            {/* QR Code */}
            {qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg border-2 border-border">
                <img 
                  src={qrCodeUrl} 
                  alt="Member QR Code" 
                  className="w-full h-auto"
                />
                <p className="text-center text-xs text-muted-foreground mt-2">
                  Show this QR code at checkout
                </p>
              </div>
            )}

            {/* Wallet Buttons */}
            {(memberData.appleUrl || memberData.googleUrl) && (
              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Add to your mobile wallet</span>
                </div>
                <div className="flex flex-col gap-2">
                  {memberData.appleUrl && (
                    <Button
                      asChild
                      className="w-full bg-black hover:bg-black/90 text-white"
                    >
                      <a href={memberData.appleUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                        </svg>
                        Add to Apple Wallet
                      </a>
                    </Button>
                  )}
                  {memberData.googleUrl && (
                    <Button
                      asChild
                      className="w-full bg-[#4285f4] hover:bg-[#4285f4]/90 text-white"
                    >
                      <a href={memberData.googleUrl} target="_blank" rel="noopener noreferrer">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Add to Google Wallet
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Save Instructions */}
        <Card className="glass-card mt-6 p-6 space-y-4">
          <h3 className="font-semibold text-lg text-center">💾 How to Save Your Card</h3>
          <div className="space-y-3 text-sm">
            {(memberData.appleUrl || memberData.googleUrl) ? (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <span className="text-xl">✨</span>
                <div>
                  <div className="font-bold text-primary">Recommended</div>
                  <div className="text-muted-foreground">Use the wallet buttons above for the best experience with push notifications!</div>
                </div>
              </div>
            ) : null}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-xl">📱</span>
              <div>
                <div className="font-bold">iPhone/iPad</div>
                <div className="text-muted-foreground">Tap Share button → "Add to Home Screen" or "Add Bookmark"</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-xl">🤖</span>
              <div>
                <div className="font-bold">Android</div>
                <div className="text-muted-foreground">Tap Menu (⋮) → "Add to Home screen"</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <span className="text-xl">💻</span>
              <div>
                <div className="font-bold">Desktop</div>
                <div className="text-muted-foreground">Press Ctrl+D (Windows) or Cmd+D (Mac) to bookmark</div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground pt-2 border-t">
            💡 Your card will always be available at this link - save it for instant access!
          </p>
        </Card>
      </div>
    </div>
  );
}
