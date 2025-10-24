import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Wallet, ChevronRight, Sparkles, Heart } from "lucide-react";

export const LuxuryMembershipCard = () => {
  const [selectedStyle, setSelectedStyle] = useState<"classic" | "elegance">("classic");

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-background via-background/95 to-background">
      <div className="container max-w-5xl mx-auto relative z-10">
        {/* Apple-style header */}
        <div className="text-center mb-8 space-y-4">
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
          
          {/* Style selector */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              onClick={() => setSelectedStyle("classic")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedStyle === "classic"
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-card border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              Classic
            </button>
            <button
              onClick={() => setSelectedStyle("elegance")}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                selectedStyle === "elegance"
                  ? "bg-foreground text-background shadow-lg scale-105"
                  : "bg-card border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              Elegance
            </button>
          </div>
        </div>

        {/* Apple-style card showcase */}
        <div className="flex justify-center mb-16">
          <div className="relative group">
            {/* Ambient glow */}
            <div className={`absolute -inset-8 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
              selectedStyle === "classic" 
                ? "bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20"
                : "bg-gradient-to-r from-pink-500/20 via-purple-500/30 to-pink-500/20"
            }`} />
            
            {/* Main card */}
            <Card className={`relative w-[380px] h-[240px] overflow-hidden border shadow-2xl backdrop-blur-xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] ${
              selectedStyle === "classic"
                ? "border-border/50 bg-gradient-to-br from-card via-card to-card/95"
                : "border-pink-500/20 bg-gradient-to-br from-pink-50/95 via-purple-50/90 to-pink-50/95 dark:from-pink-950/40 dark:via-purple-950/30 dark:to-pink-950/40"
            }`}>
              {/* Gradient overlay */}
              {selectedStyle === "classic" ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-accent/[0.03]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />
                </>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/[0.08] via-transparent to-purple-400/[0.08]" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.15] via-transparent to-transparent" />
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-300/20 to-transparent rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-300/20 to-transparent rounded-full blur-2xl" />
                </>
              )}
              
              {/* Card content */}
              <div className="relative h-full flex flex-col justify-between p-7">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xl font-semibold mb-0.5 ${
                      selectedStyle === "classic" 
                        ? "text-foreground" 
                        : "text-pink-900 dark:text-pink-100"
                    }`}>
                      Haus of Technik
                    </p>
                    <p className={`text-xs font-medium tracking-wide ${
                      selectedStyle === "classic"
                        ? "text-muted-foreground"
                        : "text-pink-600/70 dark:text-pink-400/70"
                    }`}>
                      {selectedStyle === "classic" ? "MEMBERSHIP CARD" : "ELEGANCE COLLECTION"}
                    </p>
                  </div>
                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border ${
                    selectedStyle === "classic"
                      ? "bg-primary/10 border-primary/20"
                      : "bg-pink-500/15 border-pink-500/30"
                  }`}>
                    {selectedStyle === "classic" ? (
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Heart className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400 fill-current" />
                    )}
                    <span className={`text-xs font-semibold tracking-wide ${
                      selectedStyle === "classic"
                        ? "text-primary"
                        : "text-pink-600 dark:text-pink-400"
                    }`}>
                      ACTIVE
                    </span>
                  </div>
                </div>

                {/* Member info */}
                <div className="space-y-3">
                  <div>
                    <p className={`text-sm font-medium mb-1 ${
                      selectedStyle === "classic"
                        ? "text-muted-foreground"
                        : "text-pink-600/70 dark:text-pink-400/70"
                    }`}>
                      Member Name
                    </p>
                    <p className={`text-2xl font-semibold tracking-tight ${
                      selectedStyle === "classic"
                        ? "text-foreground"
                        : "text-pink-900 dark:text-pink-100"
                    }`}>
                      Premium Member
                    </p>
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className={`text-xs font-medium mb-0.5 ${
                        selectedStyle === "classic"
                          ? "text-muted-foreground"
                          : "text-pink-600/70 dark:text-pink-400/70"
                      }`}>
                        Tier
                      </p>
                      <p className={`text-sm font-semibold ${
                        selectedStyle === "classic"
                          ? "text-foreground"
                          : "text-pink-900 dark:text-pink-100"
                      }`}>
                        Platinum
                      </p>
                    </div>
                    <div>
                      <p className={`text-xs font-medium mb-0.5 ${
                        selectedStyle === "classic"
                          ? "text-muted-foreground"
                          : "text-pink-600/70 dark:text-pink-400/70"
                      }`}>
                        Since
                      </p>
                      <p className={`text-sm font-semibold ${
                        selectedStyle === "classic"
                          ? "text-foreground"
                          : "text-pink-900 dark:text-pink-100"
                      }`}>
                        2025
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subtle edge highlight */}
              <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent to-transparent ${
                selectedStyle === "classic"
                  ? "via-primary/30"
                  : "via-pink-500/40"
              }`} />
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
