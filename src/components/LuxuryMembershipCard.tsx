import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Crown, Star } from "lucide-react";
import tpLogo from "@/assets/tp-logo.png";

export const LuxuryMembershipCard = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.15),transparent_50%)]" />
      
      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge className="mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-[gradient-shift_3s_ease_infinite] border-0 px-6 py-2 text-sm font-semibold">
            <Crown className="w-4 h-4 mr-2" />
            EXCLUSIVE MEMBERSHIP
          </Badge>
          <h2 className="text-4xl md:text-6xl font-display font-bold">
            <span className="gradient-text">Your Premium</span>
            <br />
            <span className="text-foreground">Membership Card</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience luxury with every service. Your digital card, endless benefits.
          </p>
        </div>

        <div className="flex justify-center">
          <div 
            className="relative group perspective-1000"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary via-accent to-primary opacity-30 blur-3xl group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
            
            {/* Card container with 3D effect */}
            <div className="relative transform transition-all duration-500 hover:scale-105" 
                 style={{ 
                   transform: isHovered ? 'rotateY(5deg) rotateX(-5deg)' : 'rotateY(0deg) rotateX(0deg)',
                   transformStyle: 'preserve-3d'
                 }}>
              <Card className="w-[400px] h-[250px] relative overflow-hidden border-0 shadow-2xl">
                {/* Holographic gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-accent to-primary opacity-90" />
                
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                {/* Noise texture for premium feel */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
                
                {/* Card content */}
                <div className="relative h-full flex flex-col justify-between p-8 text-white">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <img src={tpLogo} alt="Tyreplus" className="h-12 mb-2 brightness-0 invert" />
                      <p className="text-xs font-medium tracking-wider opacity-90">THOMASTOWN</p>
                    </div>
                    <div className="flex gap-1">
                      <Star className="w-5 h-5 fill-white animate-pulse" style={{ animationDelay: '0s' }} />
                      <Star className="w-5 h-5 fill-white animate-pulse" style={{ animationDelay: '0.2s' }} />
                      <Star className="w-5 h-5 fill-white animate-pulse" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>

                  {/* Middle section */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="text-2xl font-display font-bold tracking-wider">
                        PREMIUM MEMBER
                      </span>
                    </div>
                    <div className="text-sm opacity-90 tracking-wide">
                      Exclusive Benefits • Priority Service
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="text-xs opacity-75 tracking-wider">MEMBER SINCE</p>
                      <p className="text-sm font-semibold">2025</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs opacity-75 tracking-wider">TIER</p>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        <p className="text-sm font-semibold">PLATINUM</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holographic light reflection */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-radial from-white/40 to-transparent rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              </Card>

              {/* Card back shine */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" 
                   style={{ transform: 'translateZ(-10px)' }} />
            </div>
          </div>
        </div>

        {/* Features below card */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { icon: Crown, title: "VIP Treatment", desc: "Priority service every visit" },
            { icon: Sparkles, title: "Instant Rewards", desc: "$20 credit on signup" },
            { icon: Star, title: "Double Bonuses", desc: "2x points on wins" }
          ].map((feature, i) => (
            <div key={i} className="glass-card p-6 text-center space-y-3 hover:scale-105 transition-transform duration-300">
              <div className="inline-flex p-3 rounded-full bg-primary/10">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
