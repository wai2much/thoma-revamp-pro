import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { WalletPassButton } from "./WalletPassButton";
import loyaltyCardTemplate from "@/assets/loyalty-card-template.png";

export const LuxuryMembershipCard = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [passUrls, setPassUrls] = useState<{
    appleWalletUrl?: string;
    googlePayUrl?: string;
    passUrl?: string;
  }>({});
  const { user } = useAuth();

  const handleGeneratePass = async () => {
    if (!user) {
      toast.error("Please sign in to generate your membership pass");
      return;
    }

    setIsGenerating(true);
    console.log("🎫 [FRONTEND] Starting wallet pass generation...");
    
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        console.error("❌ [FRONTEND] No session found");
        toast.error("Please sign in to continue");
        return;
      }

      console.log("📞 [FRONTEND] Calling generate-wallet-pass function...");
      const { data, error } = await supabase.functions.invoke('generate-wallet-pass', {
        headers: {
          Authorization: `Bearer ${sessionData.session.access_token}`,
        },
      });

      if (error) {
        console.error("❌ [FRONTEND] Function error:", error);
        throw error;
      }

      console.log("✅ [FRONTEND] Pass generated successfully:", data);
      setPassUrls({
        appleWalletUrl: data.appleWalletUrl,
        googlePayUrl: data.googlePayUrl,
        passUrl: data.passUrl,
      });
      toast.success("Pass ready! Tap to add to your wallet.");
    } catch (error) {
      console.error("💥 [FRONTEND] Error generating pass:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate pass");
    } finally {
      setIsGenerating(false);
      console.log("🏁 [FRONTEND] Pass generation complete");
    }
  };


  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            Your Haus of Technik
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Loyalty Card
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Add your digital loyalty card to your wallet for instant access
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="relative group">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            <Card className="relative w-[380px] h-[600px] overflow-hidden border border-border/50 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-br from-card via-card to-card/95">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
              
              {/* Loyalty Card Template Display */}
              <div className="relative h-full">
                <img 
                  src={loyaltyCardTemplate} 
                  alt="Haus of Technik premium membership loyalty card with exclusive benefits" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Mock-up Member Data Overlay */}
                <div className="absolute inset-0 flex flex-col justify-between p-8">
                  {/* Top section - branding area (keep clean) */}
                  <div className="h-1/3" />
                  
                  {/* Bottom section - member details */}
                  <div className="space-y-4">
                    {/* Loyalty Points - Prominent Display */}
                    <div className="bg-black/40 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                      <p className="text-red-400 font-semibold text-xs mb-1">LOYALTY POINTS</p>
                      <p className="text-white text-3xl font-bold">1,250</p>
                    </div>
                    
                    {/* Member Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-white">
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p className="text-red-400 font-semibold text-xs mb-1">MEMBER ID</p>
                        <p className="font-mono text-sm">TP-2025-001</p>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p className="text-red-400 font-semibold text-xs mb-1">MEMBER NAME</p>
                        <p className="text-sm">John Citizen</p>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p className="text-red-400 font-semibold text-xs mb-1">MEMBER SINCE</p>
                        <p className="text-sm">January 2025</p>
                      </div>
                      <div className="bg-black/30 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                        <p className="text-red-400 font-semibold text-xs mb-1">TIER STATUS</p>
                        <p className="text-sm font-semibold">Gold</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="flex flex-col items-center mb-16 gap-3">
          <WalletPassButton
            appleUrl={passUrls.appleWalletUrl}
            googleUrl={passUrls.googlePayUrl}
            url={passUrls.passUrl}
            isGenerating={isGenerating}
            platform="auto"
            onGenerate={handleGeneratePass}
            className="px-8 py-6 text-lg h-auto"
          />
          {!user && (
            <p className="text-sm text-muted-foreground text-center">
              Sign in to generate your loyalty card
            </p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Wallet className="w-6 h-6" />,
              title: "Instant access",
              description: "Your loyalty card is always available on your device. No need to carry a physical card."
            },
            {
              icon: <Wallet className="w-6 h-6" />,
              title: "Track points",
              description: "Earn points with every service and track your rewards in real-time."
            },
            {
              icon: <Wallet className="w-6 h-6" />,
              title: "Auto-updates",
              description: "Your card updates automatically with your latest points balance and rewards."
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:border-border/50"
            >
              <div className="mb-3 text-primary">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
