import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gift, Wallet, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WalletPassButton } from "./WalletPassButton";
import bannerImage from "@/assets/banner-super-gt-4.png";

export const LoyaltyCardCapture = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [passUrls, setPassUrls] = useState<{
    appleWalletUrl?: string;
    googlePayUrl?: string;
    passUrl?: string;
  }>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    try {
      setIsGenerating(true);
      console.log("🎁 [FRONTEND] Generating loyalty card...", formData);

      const { data, error } = await supabase.functions.invoke('generate-loyalty-card', {
        body: formData,
      });

      if (error) {
        console.error("❌ [FRONTEND] Function error:", error);
        throw error;
      }

      console.log("✅ [FRONTEND] Loyalty card generated:", data);
      setPassUrls({
        appleWalletUrl: data.appleWalletUrl,
        googlePayUrl: data.googlePayUrl,
        passUrl: data.passUrl,
      });
      setShowSuccess(true);
      toast.success("Your $20 loyalty card is ready!");
    } catch (error) {
      console.error("💥 [FRONTEND] Error generating loyalty card:", error);
      toast.error("Failed to generate loyalty card. Please try again.");
    } finally {
      setIsGenerating(false);
      console.log("🏁 [FRONTEND] Loyalty card generation complete");
    }
  };

  if (showSuccess && (passUrls.appleWalletUrl || passUrls.googlePayUrl)) {
    return (
      <Card className="glass-card p-8 max-w-lg mx-auto animate-fade-in">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <Gift className="h-10 w-10 text-primary" />
            </div>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Your $20 Loyalty Card is Ready! 🎉
            </h3>
            <p className="text-muted-foreground">
              Add it to your wallet and use it on your first service
            </p>
          </div>

          <div className="space-y-3">
            <WalletPassButton
              appleUrl={passUrls.appleWalletUrl}
              googleUrl={passUrls.googlePayUrl}
              url={passUrls.passUrl}
              platform="auto"
              className="w-full h-12 bg-black hover:bg-black/90 text-white"
            />
          </div>

          <p className="text-sm text-muted-foreground mt-6">
            Check your email for details on how to use your $20 credit
          </p>
        </div>
      </Card>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Limited Time Offer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Get Your <span className="gradient-text">FREE $20</span> Loyalty Card
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No credit card required. Just enter your details and get instant access to $20 credit towards your first service.
          </p>
        </div>

        {/* Card Preview */}
        <div className="max-w-md mx-auto mb-12 animate-fade-in">
          <div className="relative overflow-hidden rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] aspect-[1.586/1] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10">
            {/* Banner Image */}
            <img 
              src={bannerImage} 
              alt="TyrePlus Loyalty Card"
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-purple-600/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
            
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              {/* Top Section - Logo & Brand */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                    <span className="text-2xl">🎁</span>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase opacity-70 text-primary-foreground">TyrePlus</div>
                    <div className="text-sm font-semibold opacity-90">Loyalty Rewards</div>
                  </div>
                </div>
                
                <div className="inline-block">
                  <div className="text-4xl font-black tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    $20
                  </div>
                  <div className="text-sm font-medium opacity-80 -mt-1">Welcome Credit</div>
                </div>
              </div>

              {/* Bottom Section - Card Details */}
              <div className="space-y-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold tracking-wider uppercase opacity-50">Member ID</div>
                    <div className="font-mono text-base font-bold tracking-wide">LP-XXXX</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold tracking-wider uppercase opacity-50">Points</div>
                    <div className="text-base font-bold">20 pts</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="opacity-50 uppercase tracking-wider">Member: </span>
                    <span className="font-semibold">Your Name</span>
                  </div>
                  <div>
                    <span className="opacity-50">Valid 1 Year</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6 flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            Your card will feature one of 3 exclusive car designs
          </p>
        </div>

        <Card className="glass-card p-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Citizen"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isGenerating}
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isGenerating}
                  className="h-12"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number (Optional)
                </label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+61 4XX XXX XXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={isGenerating}
                  className="h-12"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full h-12 text-lg"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Generating Your Card...
                </>
              ) : (
                <>
                  <Wallet className="h-5 w-5 mr-2" />
                  Get My $20 Loyalty Card
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              By submitting, you agree to receive promotional emails. You can unsubscribe anytime.
            </p>
          </form>
        </Card>

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✉️</span>
            </div>
            <h3 className="font-semibold mb-2">Fill the Form</h3>
            <p className="text-sm text-muted-foreground">Just your name and email</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold mb-2">Get Your Card</h3>
            <p className="text-sm text-muted-foreground">Instant digital wallet pass</p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎉</span>
            </div>
            <h3 className="font-semibold mb-2">Use Your $20</h3>
            <p className="text-sm text-muted-foreground">On your first service</p>
          </div>
        </div>
      </div>
    </section>
  );
};