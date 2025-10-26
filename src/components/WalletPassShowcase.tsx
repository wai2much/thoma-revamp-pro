import { Smartphone, Apple, Wallet } from "lucide-react";
import bannerImage from "@/assets/banner-racing-sunset.png";
import { useEffect, useState } from "react";
import QRCode from "qrcode";

export const WalletPassShowcase = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  useEffect(() => {
    // Generate a sample QR code for the showcase
    QRCode.toDataURL("MEMBER-1C1C1-ABC123", {
      width: 128,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    }).then(setQrCodeUrl);
  }, []);
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-secondary/30" />
      <div className="absolute inset-0 opacity-20" 
           style={{ background: 'var(--gradient-stripe)' }} 
      />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Your Membership, <span className="text-primary">Always With You</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Add your digital pass to Apple Wallet or Google Wallet for instant access
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Pass Preview */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
            <div className="relative bg-card rounded-2xl shadow-elegant overflow-hidden border border-border/50 backdrop-blur-sm">
              {/* Banner */}
              <img 
                src={bannerImage} 
                alt="TyrePlus membership wallet pass banner with premium sports car" 
                className="w-full h-48 object-cover"
                loading="lazy"
              />
              
              {/* Card Content */}
              <div className="p-6 bg-[#1C1C1C] text-white">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xs text-white/60 mb-1">PLAN</p>
                    <p className="text-lg font-bold">Single Pack</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/60 mb-1">LOYALTY POINTS</p>
                    <p className="text-2xl font-bold">1,250</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-white/60 mb-1">MEMBER ID</p>
                    <p className="font-mono text-sm">1C1C1-ABC123</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">MEMBER NAME</p>
                    <p className="text-sm">Premium Member</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-xs text-white/60 mb-1">MEMBER SINCE</p>
                    <p className="text-sm">2025</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/60 mb-1">VALID UNTIL</p>
                    <p className="text-sm">Active</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img src={qrCodeUrl} alt="QR code for TyrePlus membership digital wallet pass" className="w-32 h-32" loading="lazy" />
                  ) : (
                    <div className="w-32 h-32 bg-black/10 rounded flex items-center justify-center">
                      <span className="text-xs text-black/40">Loading...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Instant Access</h3>
                <p className="text-muted-foreground">
                  Your membership card is always available on your phone. No need to carry physical cards.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Works with Your Wallet</h3>
                <p className="text-muted-foreground">
                  Compatible with Apple Wallet and Google Wallet. Add it once and you're set.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Apple className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Automatic Updates</h3>
                <p className="text-muted-foreground">
                  Your loyalty points and membership details update automatically in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
