import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Gift, Wallet, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WalletPassButton } from "./WalletPassButton";

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
          <div className="relative overflow-hidden rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] aspect-[1.586/1] bg-gradient-to-br from-black via-zinc-900 to-black border border-zinc-800">
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
            {/* Shine effect */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-3xl" />
            
            <div className="relative h-full p-8 flex flex-col justify-between text-white">
              {/* Top Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400">TyrePlus</div>
                    <div className="text-sm font-light tracking-wide text-zinc-300 mt-1">Loyalty Card</div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <span className="text-xl">💎</span>
                  </div>
                </div>
                
                <div>
                  <div className="text-5xl font-bold tracking-tight">$20</div>
                  <div className="text-sm font-light text-zinc-400 tracking-wide mt-1">Welcome Credit</div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-1">Member ID</div>
                    <div className="font-mono text-sm font-light tracking-wider">LP-XXXX</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-zinc-500 mb-1">Points</div>
                    <div className="text-sm font-light tracking-wide">20 pts</div>
                  </div>
                </div>
                
                <div className="flex justify-between items-end text-xs border-t border-zinc-800 pt-4">
                  <div>
                    <div className="text-zinc-500 uppercase tracking-wider text-[10px] mb-1">Member</div>
                    <div className="font-light">Your Name</div>
                  </div>
                  <div className="text-right">
                    <div className="text-zinc-500 uppercase tracking-wider text-[10px] mb-1">Valid</div>
                    <div className="font-light">1 Year</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground mt-6">
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