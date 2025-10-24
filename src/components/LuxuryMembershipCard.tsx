import { Card } from "@/components/ui/card";
import { Wallet, ChevronRight, Sparkles } from "lucide-react";
import tpLogo from "@/assets/tp-logo.png";

export const LuxuryMembershipCard = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Apple-style header */}
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
            Your membership.
            <br />
            <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Always with you.
            </span>
          </h2>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Add your membership to Apple Wallet or Google Pay for instant access.
          </p>
        </div>

        {/* Apple-style card showcase */}
        <div className="flex justify-center mb-16">
          <div className="relative group">
            {/* Ambient glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            
            {/* Main card */}
            <Card className="relative w-[380px] h-[240px] overflow-hidden border border-border/50 bg-gradient-to-br from-card via-card to-card/95 shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
              
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
              
              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between p-7">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <img 
                      src={tpLogo} 
                      alt="Tyreplus" 
                      className="h-10 opacity-90 mix-blend-normal" 
                    />
                    <p className="text-xs font-medium tracking-wide text-muted-foreground">
                      THOMASTOWN
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-semibold text-primary tracking-wide">
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Member info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Member Name
                    </p>
                    <p className="text-2xl font-semibold tracking-tight text-foreground">
                      Premium Member
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Tier
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        Platinum
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-0.5">
                        Since
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle edge highlight */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </Card>
          </div>
        </div>

        {/* Apple-style wallet buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
          <button className="group relative w-full sm:w-auto px-8 py-4 bg-foreground text-background rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3">
            <Wallet className="w-5 h-5" />
            <span>Add to Apple Wallet</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button className="group relative w-full sm:w-auto px-8 py-4 bg-card border border-border/50 text-foreground rounded-xl font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-border flex items-center justify-center gap-3">
            <Wallet className="w-5 h-5" />
            <span>Add to Google Pay</span>
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* Apple-style feature grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Instant access",
              description: "Your membership is always available on your device. No need to carry a physical card."
            },
            {
              title: "Secure & private",
              description: "Your information is encrypted and protected with industry-leading security."
            },
            {
              title: "Auto-updates",
              description: "Your card updates automatically when you upgrade or renew your membership."
            }
          ].map((feature, i) => (
            <div 
              key={i} 
              className="p-6 rounded-2xl bg-card/50 border border-border/30 backdrop-blur-sm transition-all duration-300 hover:bg-card/80 hover:border-border/50"
            >
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
