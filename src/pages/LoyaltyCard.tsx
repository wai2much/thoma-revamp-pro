import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Smartphone, CreditCard } from "lucide-react";

interface MemberData {
  memberName: string;
  memberId: string;
  credit: string;
  appleUrl?: string;
  googleUrl?: string;
}

export default function LoyaltyCard() {
  const { memberId } = useParams();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
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
        const { data, error } = await supabase
          .from("loyalty_members")
          .select("*")
          .eq("member_id", memberId)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setMemberData({
            memberName: data.name || "Member",
            memberId: data.member_id,
            credit: `$${(data.points_balance || 0).toFixed(2)}`,
            appleUrl: data.apple_url,
            googleUrl: data.google_url,
          });
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
      <div className="max-w-md mx-auto pt-12">
        {/* Header */}
        <div className="text-center mb-8">
          <CreditCard className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold mb-2">TyrePlus Loyalty Card</h1>
          <p className="text-muted-foreground">Welcome, {memberData.memberName}!</p>
        </div>

        {/* Credit Display */}
        <Card className="glass-card p-6 mb-6 text-center">
          <div className="text-sm text-muted-foreground mb-1">Your Welcome Credit</div>
          <div className="text-5xl font-bold text-primary">{memberData.credit}</div>
          <div className="text-xs text-muted-foreground mt-2">ID: {memberData.memberId}</div>
        </Card>

        {/* Wallet Pass Buttons */}
        {(memberData.appleUrl || memberData.googleUrl) ? (
          <Card className="glass-card p-6 space-y-4">
            <div className="text-center">
              <Smartphone className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h2 className="font-semibold text-lg">Add to Your Wallet</h2>
              <p className="text-sm text-muted-foreground">Get your digital card with push notifications</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {memberData.appleUrl && (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-black hover:bg-black/90 text-white h-14"
                >
                  <a href={memberData.appleUrl} target="_blank" rel="noopener noreferrer">
                    <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                    </svg>
                    Add to Apple Wallet
                  </a>
                </Button>
              )}
              {memberData.googleUrl && (
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-[#4285f4] hover:bg-[#4285f4]/90 text-white h-14"
                >
                  <a href={memberData.googleUrl} target="_blank" rel="noopener noreferrer">
                    <svg className="h-6 w-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
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
          </Card>
        ) : (
          <Card className="glass-card p-6 text-center">
            <Loader2 className="h-6 w-6 mx-auto mb-2 animate-spin text-muted-foreground" />
            <p className="text-muted-foreground">Generating your wallet pass...</p>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Haus of Technik × TyrePlus Loyalty Program
        </p>
      </div>
    </div>
  );
}
