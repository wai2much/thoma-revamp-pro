import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Star, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import bannerSuperGt from "@/assets/banner-super-gt.png";
import bannerSports from "@/assets/banner-sports.png";
import banner190e from "@/assets/banner-190e.png";
import amgBloomHero from "@/assets/products/amg-bloom-nobg.png";
import amgBloom100 from "@/assets/products/amg-bloom-100ml.png";
import hausNoir100 from "@/assets/products/haus-noir-100ml.png";
import hausNoirGtr100 from "@/assets/products/haus-noir-gtr-100ml.png";
import m3Loing100 from "@/assets/products/m3-loing-100ml.png";
import nSkrrt100 from "@/assets/products/n-skrrt-100ml.png";
import gtrGod100 from "@/assets/products/gtr-god-100ml.png";

export const Hero = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [bannerSuperGt, bannerSports, banner190e];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const scrollToPlans = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToLocations = () => {
    document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 pt-20 cyber-grid" aria-label="Hero section">
      {/* Dark cyberpunk background */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Neon gradient overlay */}
      <div className="absolute inset-0 opacity-60 animate-[gradient-shift_25s_ease_infinite]" 
           style={{ 
             background: 'var(--gradient-stripe)',
             backgroundSize: '200% 200%'
           }} 
      />
      
      {/* Scan lines effect */}
      <div className="absolute inset-0 scan-lines opacity-30" />
      
      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      
      {/* Animated neon dots */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-primary rounded-full pulse-glow" />
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full pulse-glow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-40 left-20 w-2 h-2 bg-primary rounded-full pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-60 left-1/4 w-1 h-1 bg-primary rounded-full pulse-glow" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-60 right-1/4 w-2 h-2 bg-accent rounded-full pulse-glow" style={{ animationDelay: '1.5s' }} />
      
      <div className="container max-w-6xl mx-auto relative z-10" style={{ perspective: '1500px' }}>
        <div className="animate-fade-in" style={{ 
          transform: 'rotateX(15deg) translateY(-20px)',
          transformStyle: 'preserve-3d'
        }}>
          {/* Trust badge */}
          <div className="flex items-center justify-center gap-2 mb-8 opacity-0 animate-fade-in">
            <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest font-mono">Haus of Technik // System Online</p>
          </div>

          {/* Main headline */}
          <div className="text-center space-y-6 mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-wider uppercase opacity-0 animate-slide-up text-glow-cyan" style={{ animationDelay: '0.1s' }}>
              Car care made
              <br />
              <span className="gradient-text">simple and affordable</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto opacity-0 animate-fade-in font-sans" style={{ animationDelay: '0.3s' }}>
              Membership-based car maintenance that saves you time and money. All-inclusive plans starting at <span className="text-primary font-semibold text-glow-cyan">$55/month</span>.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 opacity-0 animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <Button 
              size="lg" 
              onClick={scrollToPlans}
              className="group bg-primary hover:bg-primary/90 text-primary-foreground neon-glow uppercase tracking-wider font-semibold"
            >
              View Membership Plans
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={scrollToLocations}
              className="border-primary/50 hover:bg-primary/10 hover:border-primary uppercase tracking-wider glow-border"
            >
              Find a Location
            </Button>
          </div>

          {/* AMG Bloom Hero Product */}
          <div className="flex justify-center mb-12 opacity-0 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent blur-3xl scale-150 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
              <img 
                src={amgBloomHero} 
                alt="AMG Bloom Luxury Auto Fragrance" 
                className="h-[280px] md:h-[350px] lg:h-[420px] w-auto object-contain relative z-10 drop-shadow-2xl transition-transform duration-700 group-hover:scale-105"
                style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))' }}
              />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center">
                <p className="text-sm font-medium text-primary uppercase tracking-widest">AMG Bloom</p>
                <p className="text-xs text-muted-foreground">Luxury Auto Fragrance</p>
              </div>
            </div>
          </div>

          {/* Product Showcase - 6 Fragrances */}
          <div className="mb-16 opacity-0 animate-fade-in" style={{ animationDelay: '0.65s' }}>
            <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-8">Our Collection</p>
            <div className="flex flex-wrap justify-center items-end gap-4 md:gap-8">
              {[
                { src: amgBloom100, name: "AMG Bloom" },
                { src: hausNoir100, name: "Haus Noir" },
                { src: hausNoirGtr100, name: "GTR Edition" },
                { src: m3Loing100, name: "M3 Lo-ing" },
                { src: nSkrrt100, name: "N Skrrt" },
                { src: gtrGod100, name: "GTR God" },
              ].map((product, i) => (
                <a 
                  key={product.name} 
                  href="/shop"
                  className="group relative flex flex-col items-center cursor-pointer"
                  style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 blur-2xl scale-125 opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
                    <img 
                      src={product.src} 
                      alt={product.name}
                      className="h-24 md:h-32 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2"
                      style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">{product.name}</p>
                </a>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto opacity-0 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
              <div className="text-5xl font-display font-bold mb-2 gradient-text">Growing</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Customer Base</div>
            </div>
            <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
              <div className="text-5xl font-display font-bold mb-2 gradient-text">Premium</div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Service Quality</div>
            </div>
            <div className="glass-card rounded-xl p-8 text-center group cursor-pointer">
              <div className="text-5xl font-display font-bold mb-2 text-primary">4.9</div>
              <div className="flex justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground uppercase tracking-wider">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Phone floating button - positioned above WhatsApp button */}
      <a
        href="tel:94624400"
        className="fixed bottom-44 right-6 z-[60] bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-2xl pulse-glow animate-fade-in"
        style={{ boxShadow: '0 0 30px rgba(var(--primary-rgb), 0.3)', animationDelay: '0.2s' }}
        aria-label="Call shop: 9462 4400"
      >
        <Phone className="h-6 w-6" />
      </a>

      {/* WhatsApp floating button - positioned on the right side above Tessa */}
      <a
        href="https://wa.me/61451590517?text=Hi!%20I%27m%20interested%20in%20your%20car%20service%20membership"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-6 z-[60] bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl pulse-glow animate-fade-in"
        style={{ boxShadow: '0 0 30px rgba(37, 211, 102, 0.3)' }}
        aria-label="Contact us on WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </section>
  );
};
