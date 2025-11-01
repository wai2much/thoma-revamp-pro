import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import QRCode from "qrcode";
import { Loader2 } from "lucide-react";

interface MemberData {
  memberName: string;
  memberEmail: string;
  memberPhone: string;
  memberId: string;
  memberSince: string;
  credit: string;
  points: number;
}

export default function LoyaltyCard() {
  const { memberId } = useParams();
  const [memberData, setMemberData] = useState<MemberData | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberData = async () => {
      if (!memberId) return;

      try {
        // Fetch member data from loyalty_points
        const { data, error } = await supabase
          .from("loyalty_points")
          .select("*")
          .eq("order_id", `MEMBER-${memberId}`)
          .single();

        if (error) throw error;

        if (data) {
          const parsedData: MemberData = {
            memberName: data.description.split(" - ")[0] || "Member",
            memberEmail: data.description.split(" - ")[1] || "",
            memberPhone: data.description.split(" - ")[2] || "",
            memberId: memberId,
            memberSince: new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            credit: `$${(data.points / 1).toFixed(2)}`,
            points: data.points
          };

          setMemberData(parsedData);

          // Generate QR code
          const qrData = `TYREPLUS-LOYALTY-${memberId}`;
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
        <Card className="p-8 text-center">
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
          <h1 className="text-3xl font-bold mb-2">TyrePlus Loyalty Card</h1>
          <p className="text-muted-foreground">Your digital membership card</p>
        </div>

        <Card className="overflow-hidden shadow-2xl">
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
          </div>
        </Card>

        {/* Instructions */}
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            💡 Bookmark this page or add it to your home screen for easy access
          </p>
          <p className="text-xs text-muted-foreground">
            Your card is always available at this link
          </p>
        </div>
      </div>
    </div>
  );
}
